import express, { type Request, type Response } from "express"

import { pool } from "../database.js"
import { authenticateToken, conditionalAuthenticateToken } from "../middleware/authMiddleware.js"
import {
  validateProposalInput,
} from "../services/formValidation.js"
import { parseFilters, normalizeProposalInput } from "../utils/parse.js"
import type {
  Proposal,
  ProposalSearchItem,
  ProposalInput,
  Attachment,
  UserRef,
  CategoryRef,
  StatusRef,
  LocalizedText,
} from "../../../shared/models.js"

const router = express.Router()

router.post(
  "/bozza",
  authenticateToken,
  async (req: Request<unknown, unknown, ProposalInput>, res: Response) => {
    try {
      const userId = Number(req.user!.sub)
      const input: ProposalInput = req.body

      normalizeProposalInput(input)

      try {
        await validateProposalInput(input, { context: 'draft' })
      } catch (err) {
        if (err instanceof Error) return res.status(400).json({ error: err.message })
        throw err
      }

      const insertRes = await pool.query(
        `INSERT INTO proposals (
            title, description, category_id, author_id, status_id, additional_data, current_version, created_at, updated_at
          ) VALUES (
            $3, $4, $1, $2,
            (SELECT id FROM statuses WHERE code = 'bozza' LIMIT 1),
            $5::jsonb, 1, NOW(), NOW()
          )
          RETURNING id`,
        [input.categoryId, userId, input.title, input.description ?? '', input.additionalData ?? {}],
      )

      return res.status(201).json({ id: insertRes.rows[0].id })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Failed to create draft" })
    }
  },
)

router.patch(
  "/:id",
  authenticateToken,
  async (req: Request<{ id: string }, unknown, ProposalInput>, res: Response) => {
    try {
      const proposalId = Number(req.params.id)
      const userId = Number(req.user!.sub)
      const input: ProposalInput = req.body

      const check = await pool.query(
        `SELECT p.author_id, p.category_id, s.code as status_code
         FROM proposals p
         JOIN statuses s ON p.status_id = s.id
         WHERE p.id = $1`,
        [proposalId],
      )

      if (check.rowCount === 0) return res.status(404).json({ error: "Not found" })
      const meta = check.rows[0]

      if (meta.author_id !== userId) return res.status(403).json({ error: "Unauthorized" })

      if (meta.status_code !== "bozza") {
        return res.status(400).json({ error: "Cannot patch a published proposal. Use PUT to update." })
      }

      normalizeProposalInput(input)

      try {
        await validateProposalInput(input, { context: 'draft' })
      } catch (err) {
        if (err instanceof Error) return res.status(400).json({ error: err.message })
        throw err
      }

      const fields: string[] = []
      const values: unknown[] = []
      let idx = 1

      if (input.title !== undefined) { fields.push(`title = $${idx++}`); values.push(input.title) }
      if (input.description !== undefined) { fields.push(`description = $${idx++}`); values.push(input.description) }
      if (input.categoryId !== undefined) { fields.push(`category_id = $${idx++}`); values.push(input.categoryId) }
      if (input.additionalData !== undefined) { fields.push(`additional_data = $${idx++}`); values.push(input.additionalData ?? {}) }

      if (fields.length === 0) return res.status(400).json({ error: "No fields provided" })

      fields.push(`updated_at = NOW()`)
      values.push(proposalId)

      await pool.query(`UPDATE proposals SET ${fields.join(", ")} WHERE id = $${idx}`, values)

      return res.json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Error saving draft" })
    }
  },
)

router.post(
  "/:id/pubblica",
  authenticateToken,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const proposalId = Number(req.params.id)
      const userId = Number(req.user!.sub)

      const propRes = await pool.query(
        `SELECT p.*, s.code as status_code
           FROM proposals p
           JOIN statuses s ON p.status_id = s.id
           WHERE p.id = $1`,
        [proposalId]
      )
      if (propRes.rowCount === 0) return res.status(404).json({ error: "Not found" })
      const proposal = propRes.rows[0]

      if (proposal.author_id !== userId) return res.status(403).json({ error: "Unauthorized" })

      if (proposal.status_code !== 'bozza') {
        return res.status(400).json({ error: "Proposal is not a draft and cannot be published." })
      }

      const input: ProposalInput = {
        title: proposal.title,
        description: proposal.description,
        categoryId: proposal.category_id,
        additionalData: proposal.additional_data ?? {},
      }

      try {
        await validateProposalInput(input, { context: 'publish', proposalId })
      } catch (err) {
        if (err instanceof Error) return res.status(400).json({ error: err.message })
        throw err
      }


      await pool.query(
        `UPDATE proposals
           SET status_id = (SELECT id FROM statuses WHERE code = 'pubblicata' LIMIT 1),
               updated_at = NOW()
           WHERE id = $1`,
        [proposalId]
      )

      return res.json({})
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Error publishing" })
    }
  },
)

router.put(
  "/:id",
  authenticateToken,
  async (req: Request<{ id: string }, unknown, ProposalInput>, res: Response) => {
    try {
      const proposalId = Number(req.params.id)
      const userId = Number(req.user!.sub)
      const input: ProposalInput = req.body

      const check = await pool.query(
        `SELECT p.author_id, p.category_id, s.code as status_code
         FROM proposals p
         JOIN statuses s ON p.status_id = s.id
         WHERE p.id = $1`,
        [proposalId]
      )
      if (check.rowCount === 0) return res.status(404).json({ error: "Not found" })
      const current = check.rows[0]

      if (current.author_id !== userId) return res.status(403).json({ error: "Unauthorized" })

      if (current.status_code === 'bozza') {
        return res.status(400).json({ error: "Proposal is a draft. Use PATCH to save or POST /pubblica to publish." })
      }

      normalizeProposalInput(input)

      try {
        await validateProposalInput(input, { context: 'update', proposalId })
      } catch (err) {
        if (err instanceof Error) return res.status(400).json({ error: err.message })
        throw err
      }

      const fields: string[] = []
      const values: unknown[] = []
      let idx = 1

      fields.push(`title = $${idx++}`); values.push(input.title)
      fields.push(`description = $${idx++}`); values.push(input.description)
      fields.push(`category_id = $${idx++}`); values.push(input.categoryId)
      fields.push(`additional_data = $${idx++}`); values.push(input.additionalData ?? {})

      fields.push(`current_version = current_version + 1`)
      fields.push(`vote_value = 0`)
      fields.push(`updated_at = NOW()`)

      values.push(proposalId)

      const query = `UPDATE proposals SET ${fields.join(", ")} WHERE id = $${idx}`
      await pool.query(query, values)

      return res.json({})

    } catch (err) {
      console.error("Update published error:", err)
      return res.status(500).json({ error: "Failed to update proposal" })
    }
  },
)

router.get(
  "/",
  conditionalAuthenticateToken,
  async (
    req: Request<unknown, unknown, unknown, Record<string, unknown>>,
    res: Response<ProposalSearchItem[] | { error: string }>,
  ) => {
    try {
      const userId = req.user ? Number(req.user.sub) : undefined
      const filters = parseFilters(req.query)

      if (filters.favourites === true && !userId) {
        return res.status(401).json({ error: "Authentication required for favourites filter" })
      }

      const conditions: string[] = []
      const values: unknown[] = []

      if (!filters.statusId && !filters.statusCode) {
        const searchingSelf = userId && filters.authorId === userId
        if (!searchingSelf) {
          conditions.push(`s.code != 'bozza'`)
        }
      }

      if (filters.q) {
        const idx = values.push(`%${filters.q}%`)
        if (filters.titlesOnly) {
          conditions.push(`p.title ILIKE $${idx}`)
        } else {
          conditions.push(`(p.title ILIKE $${idx} OR p.description ILIKE $${idx})`)
        }
      }

      if (filters.authorId) {
        const idx = values.push(filters.authorId)
        conditions.push(`p.author_id = $${idx}`)
      } else if (filters.authorUsername) {
        const idx = values.push(filters.authorUsername)
        conditions.push(`u.username = $${idx}`)
      }

      if (filters.categoryId) {
        const idx = values.push(filters.categoryId)
        conditions.push(`p.category_id = $${idx}`)
      } else if (filters.categoryCode) {
        const idx = values.push(filters.categoryCode)
        conditions.push(`c.code = $${idx}`)
      }

      if (filters.statusId) {
        const idx = values.push(filters.statusId)
        conditions.push(`p.status_id = $${idx}`)
      } else if (filters.statusCode) {
        const idx = values.push(filters.statusCode)
        conditions.push(`s.code = $${idx}`)
      }

      if (filters.minVotes !== undefined) {
        const idx = values.push(filters.minVotes)
        conditions.push(`p.vote_value >= $${idx}`)
      }
      if (filters.maxVotes !== undefined) {
        const idx = values.push(filters.maxVotes)
        conditions.push(`p.vote_value <= $${idx}`)
      }
      if (filters.dateFrom) {
        const idx = values.push(filters.dateFrom)
        conditions.push(`p.created_at >= $${idx}::timestamptz`)
      }
      if (filters.dateTo) {
        const idx = values.push(filters.dateTo)
        conditions.push(`p.created_at <= $${idx}::timestamptz`)
      }

      let selectIsFavourited = "false AS is_favourited"
      if (userId) {
        const idxUser = values.push(userId)
        const favExists = `EXISTS(SELECT 1 FROM favourites f WHERE f.proposal_id = p.id AND f.user_id = $${idxUser})`
        selectIsFavourited = `${favExists} AS is_favourited`
        if (filters.favourites === true) {
          conditions.push(favExists)
        }
      }

      const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""

      let orderByClause = "ORDER BY p.created_at DESC"
      if (filters.sortBy) {
        const dir = filters.sortOrder === "asc" ? "ASC" : "DESC"
        switch (filters.sortBy) {
          case "votes": orderByClause = `ORDER BY p.vote_value ${dir}`; break
          case "title": orderByClause = `ORDER BY p.title ${dir}`; break
          case "date": orderByClause = `ORDER BY p.created_at ${dir}`; break
        }
      }

      const query = `
        SELECT
          p.id, p.title, p.description, p.vote_value, p.created_at,
          
          u.id AS author_id,
          u.username AS author_username,
          
          c.id AS category_id,
          c.labels AS category_labels,
          c.code AS category_code, 
          c.colour AS category_colour,
          
          s.id AS status_id,
          s.labels AS status_labels, 
          s.code AS status_code, 
          s.colour AS status_colour,
          
          ${selectIsFavourited}
        FROM proposals p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN statuses s ON p.status_id = s.id
        ${whereClause}
        ${orderByClause}
      `

      const result = await pool.query(query, values)

      interface ProposalRow {
        id: number
        title: string
        description: string
        vote_value: number
        created_at: Date
        is_favourited: boolean
        
        author_id: number
        author_username: string

        category_id: number | null
        category_labels: LocalizedText
        category_code: string
        category_colour: string

        status_id: number | null
        status_labels: LocalizedText
        status_code: string
        status_colour: string
      }

      const items: ProposalSearchItem[] = result.rows.map((row) => {
        const r = row as ProposalRow
        
        const authorRef: UserRef = {
            id: r.author_id,
            username: r.author_username,
        }

        const categoryRef: CategoryRef | undefined = r.category_id ? {
            id: r.category_id,
            code: r.category_code,
            labels: r.category_labels,
            colour: r.category_colour
        } as CategoryRef : undefined

        const statusRef: StatusRef | undefined = r.status_id ? {
            id: r.status_id,
            code: r.status_code,
            labels: r.status_labels,
            colour: r.status_colour
        } as StatusRef : undefined

        return {
          type: "proposta",
          id: r.id,
          title: r.title,
          description: r.description,
          voteValue: Number(r.vote_value),
          date: new Date(r.created_at).toLocaleDateString("it-IT"),
          createdAt: new Date(r.created_at).toISOString(),
          isFavourited: Boolean(r.is_favourited),
          
          author: authorRef,
          
          ...(categoryRef ? { category: categoryRef } : {}),
          ...(statusRef ? { status: statusRef } : {})
        }
      })

      return res.json(items)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Failed to fetch proposals" })
    }
  },
)

router.get(
  "/:id",
  conditionalAuthenticateToken,
  async (req: Request<{ id: string }>, res: Response<Proposal | { error:string }>) => {
    try {
      const id = Number(req.params.id)
      const userId = req.user ? Number(req.user.sub) : undefined

      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" })

      const result = await pool.query(
        `SELECT
            p.*,
            c.code AS category_code, c.labels ->> 'it' AS category_name, c.colour AS category_colour,
            s.code AS status_code, s.labels ->> 'it' AS status_name, s.colour AS status_colour,
            u.username AS author_name,
            EXISTS(SELECT 1 FROM favourites f WHERE f.proposal_id = p.id AND f.user_id = $2) AS is_favourited,
            (
              SELECT json_agg(json_build_object(
                'id', a.id, 'proposalId', a.proposal_id, 'fileUrl', a.file_url,
                'fileType', a.file_type, 'fileName', a.file_name,
                'uploadedAt', a.uploaded_at, 'slotKey', a.slot_key
              ))
              FROM attachments a WHERE a.proposal_id = p.id
            ) AS attachments
         FROM proposals p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN statuses s ON p.status_id = s.id
         LEFT JOIN users u ON p.author_id = u.id
         WHERE p.id = $1`,
        [id, userId ?? null],
      )

      if (result.rowCount === 0) return res.status(404).json({ error: "Not found" })

      const r = result.rows[0]

      if (r.status_code === "bozza" && r.author_id !== userId) {
        return res.status(404).json({ error: "Not found" })
      }

      interface RawAttachment {
        id: number
        proposalId: number
        fileUrl: string
        fileType?: string
        fileName?: string
        uploadedAt: string
        slotKey?: string
      }

      const attachmentsRaw = (Array.isArray(r.attachments) ? r.attachments : []) as RawAttachment[]

      const attachments: Attachment[] = attachmentsRaw
        .filter(Boolean)
        .map((a) => ({
          id: a.id,
          proposalId: a.proposalId,
          fileUrl: a.fileUrl,
          uploadedAt: new Date(a.uploadedAt).toISOString(),
          ...(a.fileType ? { fileType: a.fileType } : {}),
          ...(a.fileName ? { fileName: a.fileName } : {}),
          ...(a.slotKey ? { slotKey: a.slotKey } : {}),
        }))

      const proposal: Proposal = {
        id: r.id,
        title: r.title,
        description: r.description,
        voteValue: Number(r.vote_value),
        additionalData: r.additional_data ?? {},
        currentVersion: r.current_version,
        author: { id: r.author_id, username: r.author_name },
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
        isFavourited: Boolean(r.is_favourited),
        category: {
          id: r.category_id,
          code: r.category_code,
          ...(r.category_name ? { labels: r.category_name } : {}),
          ...(r.category_colour ? { colour: r.category_colour } : {})
        },
        status: {
          id: r.status_id,
          code: r.status_code,
          ...(r.status_name ? { labels: r.status_name } : {}),
          ...(r.status_colour ? { colour: r.status_colour } : {})
        },
        ...(attachments.length > 0 ? { attachments } : {})
      }

      return res.json(proposal)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Failed to fetch proposal" })
    }
  },
)

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request<{ id: string }>, res: Response<void | { error: string }>) => {
    try {
      const id = Number(req.params.id)
      const userId = Number(req.user!.sub)

      const check = await pool.query(`SELECT author_id FROM proposals WHERE id = $1`, [id])
      if (check.rowCount === 0) return res.status(404).json({ error: "Not found" })

      if (check.rows[0].author_id !== userId) return res.status(403).json({ error: "Unauthorized" })

      await pool.query(`DELETE FROM proposals WHERE id = $1`, [id])

      return res.sendStatus(204)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Delete failed" })
    }
  },
)

router.post(
  "/:id/vota",
  authenticateToken,
  async (req: Request<{ id: string }, unknown, { vote?: number }>, res: Response<{ vote: number; totalVotes: number } | { error: string }>) => {
    const client = await pool.connect()
    try {
      const userId = Number(req.user!.sub)
      const proposalId = Number(req.params.id)
      const { vote } = req.body

      if (vote !== 1 && vote !== -1) return res.status(400).json({ error: "Invalid vote" })

      const check = await pool.query("SELECT status_id FROM proposals WHERE id = $1", [proposalId])
      if (check.rows.length === 0) return res.status(404).json({ error: "Non trovato" })
      if (check.rows[0].status_code === 'bozza') return res.status(400).json({ error: "Non puoi votare una bozza" })

      await client.query("BEGIN")

      const exists = await client.query("SELECT current_version FROM proposals WHERE id=$1 FOR UPDATE", [proposalId])
      if (exists.rowCount === 0) {
        await client.query("ROLLBACK")
        return res.status(404).json({ error: "Not found" })
      }
      const currentVersion = exists.rows[0].current_version

      await client.query(
        `INSERT INTO proposal_votes (user_id, proposal_id, proposal_version, vote_value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, proposal_id, proposal_version)
         DO UPDATE SET vote_value = EXCLUDED.vote_value, created_at = NOW()`,
        [userId, proposalId, currentVersion, vote],
      )

      const sumRes = await client.query(
        `SELECT COALESCE(SUM(vote_value), 0) AS total FROM proposal_votes
         WHERE proposal_id = $1 AND proposal_version = $2`,
        [proposalId, currentVersion],
      )
      const total = Number(sumRes.rows[0].total)

      await client.query("UPDATE proposals SET vote_value = $1 WHERE id = $2", [total, proposalId])

      await client.query("COMMIT")

      return res.json({ vote, totalVotes: total })
    } catch (err) {
      await client.query("ROLLBACK")
      console.error(err)
      return res.status(500).json({ error: "Vote failed" })
    } finally {
      client.release()
    }
  },
)

router.delete(
  "/:id/vota",
  authenticateToken,
  async (req: Request<{ id: string }>, res: Response<{ totalVotes: number } | { error: string }>) => {
    const client = await pool.connect()
    try {
      const userId = Number(req.user!.sub)
      const proposalId = Number(req.params.id)

      await client.query("BEGIN")

      const exists = await client.query("SELECT current_version FROM proposals WHERE id=$1 FOR UPDATE", [proposalId])
      if (exists.rowCount === 0) {
        await client.query("ROLLBACK")
        return res.status(404).json({ error: "Not found" })
      }
      const currentVersion = exists.rows[0].current_version

      await client.query(
        `DELETE FROM proposal_votes
         WHERE user_id = $1 AND proposal_id = $2 AND proposal_version = $3`,
        [userId, proposalId, currentVersion],
      )

      const sumRes = await client.query(
        `SELECT COALESCE(SUM(vote_value), 0) AS total FROM proposal_votes
         WHERE proposal_id = $1 AND proposal_version = $2`,
        [proposalId, currentVersion],
      )
      const total = Number(sumRes.rows[0].total)
      await client.query("UPDATE proposals SET vote_value = $1 WHERE id = $2", [total, proposalId])

      await client.query("COMMIT")

      return res.json({ totalVotes: total })
    } catch (err) {
      await client.query("ROLLBACK")
      console.error(err)
      return res.status(500).json({ error: "Vote removal failed" })
    } finally {
      client.release()
    }
  },
)

router.get(
  "/:id/vota",
  authenticateToken,
  async (req: Request<{ id: string }>, res: Response<{ vote: -1 | 1 | null } | { error: string }>) => {
    try {
      const userId = Number(req.user!.sub)
      const proposalId = Number(req.params.id)

      const resVote = await pool.query(
        `SELECT vote_value FROM proposal_votes
         WHERE user_id=$1 AND proposal_id=$2 AND proposal_version=(SELECT current_version FROM proposals WHERE id=$2)`,
        [userId, proposalId],
      )

      const voteData = (resVote.rowCount ?? 0) > 0
        ? { voteValue: resVote.rows[0].vote_value as -1 | 1 }
        : null
      const vote = voteData ? voteData.voteValue : null
      return res.json({ vote })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Error fetching vote" })
    }
  },
)

router.post(
  "/:id/preferisco",
  authenticateToken,
  async (req: Request<{ id: string }>, res: Response<{ isFavourited: boolean } | { error: string }>) => {
    try {
      const userId = Number(req.user!.sub)
      const proposalId = Number(req.params.id)

      const exists = await pool.query("SELECT 1 FROM proposals WHERE id=$1", [proposalId])
      if (exists.rowCount === 0) return res.status(404).json({ error: "Not found" })

      await pool.query(
        `INSERT INTO favourites (user_id, proposal_id) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id, proposal_id) WHERE proposal_id IS NOT NULL 
         DO NOTHING`, 
        [userId, proposalId]
      )

      return res.json({ isFavourited: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Error adding favourite" })
    }
  },
)

router.delete(
  "/:id/preferisco",
  authenticateToken,
  async (req: Request<{ id: string }>, res: Response<{ isFavourited: boolean } | { error: string }>) => {
    try {
      const userId = Number(req.user!.sub)
      const proposalId = Number(req.params.id)

      await pool.query(`DELETE FROM favourites WHERE user_id=$1 AND proposal_id=$2`, [userId, proposalId])
      return res.json({ isFavourited: false })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Error removing favourite" })
    }
  },
)

router.get(
  "/:id/preferisco",
  conditionalAuthenticateToken,
  async (req: Request<{ id: string }>, res: Response<{ isFavourited: boolean } | { error: string }>) => {
    try {
      const id = Number(req.params.id)
      const userId = req.user ? Number(req.user.sub) : null

      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" })

      if (!userId) return res.json({ isFavourited: false })

      const r = await pool.query(`SELECT 1 FROM favourites WHERE proposal_id = $1 AND user_id = $2`, [id, userId])
      return res.json({ isFavourited: Boolean(r.rowCount) })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Error fetching favourite" })
    }
  },
)

export default router