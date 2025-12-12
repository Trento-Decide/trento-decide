import express, { type Request, type Response } from "express"

import type { SearchResultItem } from "../../../shared/models.js"
import { pool } from "../database.js"
import { authenticateToken, conditionalAuthenticateToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", conditionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user ? Number(req.user.sub) : undefined

    const {
      q,
      titlesOnly,
      category,
      status,
      author,
      authorId,
      favourites,
      minVotes,
      maxVotes,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    } = req.query as Record<string, string>

    if (favourites === 'true' && !userId) {
      return res.status(401).json({
        error: "Authentication is required to filter by favourites",
      })
    }

    const conditions: string[] = []
    const values: any[] = []

    let selectIsFavourited = "false AS is_favourited"
    let favoritesJoin = ""

    if (userId) {
      values.push(userId)
      favoritesJoin = `
        LEFT JOIN favourites f
        ON p.id = f.proposal_id
        AND f.user_id = $${values.length}
      `
      selectIsFavourited = `(f.user_id IS NOT NULL) AS is_favourited`
    }

    if (q) {
      const idx = values.push(`%${q}%`)
      if (titlesOnly === 'true') {
        conditions.push(`p.title ILIKE $${idx}`)
      } else {
        conditions.push(`(p.title ILIKE $${idx} OR p.description ILIKE $${idx})`)
      }
    }

    if (authorId) {
      const idx = values.push(Number(authorId))
      conditions.push(`p.author_id = $${idx}`)
    }

    if (author) {
      const idx = values.push(`%${author}%`)
      conditions.push(`u.username ILIKE $${idx}`)
    }

    if (category) {
      if (!isNaN(Number(category))) {
        const idx = values.push(Number(category))
        conditions.push(`p.category_id = $${idx}`)
      } else {
        const idx = values.push(category)
        conditions.push(`c.code = $${idx}`)
      }
    }

    if (status) {
      if (!isNaN(Number(status))) {
        const idx = values.push(Number(status))
        conditions.push(`p.status_id = $${idx}`)
      } else {
        const idx = values.push(status)
        conditions.push(`s.code = $${idx}`)
      }
    }

    if (favourites === 'true' && userId) {
      conditions.push(`f.user_id IS NOT NULL`)
    }

    if (minVotes) {
      const idx = values.push(Number(minVotes))
      conditions.push(`p.vote_value >= $${idx}`)
    }
    if (maxVotes) {
      const idx = values.push(Number(maxVotes))
      conditions.push(`p.vote_value <= $${idx}`)
    }

    if (dateFrom) {
      const idx = values.push(dateFrom)
      conditions.push(`p.created_at >= $${idx}::date`)
    }
    if (dateTo) {
      const idx = values.push(dateTo)
      conditions.push(`p.created_at < ($${idx}::date + INTERVAL '1 day')`)
    }

    const whereClause = conditions.length > 0
      ? "WHERE " + conditions.join(" AND ")
      : ""

    let orderByClause = "ORDER BY p.created_at DESC"
    if (sortBy) {
      const dir = sortOrder === "asc" ? "ASC" : "DESC"
      switch (sortBy) {
        case "votes":
          orderByClause = `ORDER BY p.vote_value ${dir}`
          break
        case "title":
          orderByClause = `ORDER BY p.title ${dir}`
          break
        case "date":
          orderByClause = `ORDER BY p.created_at ${dir}`
          break
      }
    }

    const query = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.category_id,
        c.code AS category_code,
        c.labels ->> 'it' AS category_name,
        c.colour AS category_colour,
        p.author_id,
        u.username AS author_name,
        p.created_at,
        s.code AS status_code,
        s.labels ->> 'it' AS status_name,
        s.colour AS status_colour,
        p.vote_value AS vote_count,
        ${selectIsFavourited}
      FROM proposals p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN statuses s ON p.status_id = s.id
      ${favoritesJoin}
      ${whereClause}
      ${orderByClause}
    `

    const result = await pool.query(query, values)

    const proposte: SearchResultItem[] = result.rows.map((r: any) => ({
      type: "proposta",
      id: r.id,
      title: r.title,
      description: r.description,
      author: r.author_name,
      category: r.category_name ?? r.category_code,
      categoryColour: r.category_colour ?? undefined,
      status: r.status_name ?? r.status_code,
      statusColour: r.status_colour ?? undefined,
      score: Number(r.vote_count),
      date: new Date(r.created_at).toLocaleDateString("it-IT"),
      timestamp: new Date(r.created_at).toISOString(),
    }))

    res.json({
      data: proposte,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to fetch proposals",
      details: err instanceof Error ? err.message : String(err),
    })
  }
})

router.get("/:id", conditionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user ? Number(req.user.sub) : undefined

    const result = await pool.query(
      `
        SELECT 
          p.id,
          p.title,
          p.description,
          p.category_id,
          c.code AS category_code,
          c.labels ->> 'it' AS category_name,
          c.colour AS category_colour,
          s.code AS status_code,
          s.labels ->> 'it' AS status_name,
          s.colour AS status_colour,
          p.created_at,
          u.username AS author_name,
          p.vote_value AS vote_count,
          (f.user_id IS NOT NULL) AS is_favourited
        FROM proposals p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN statuses s ON p.status_id = s.id
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN favourites f ON p.id = f.proposal_id AND f.user_id = $2
        WHERE p.id = $1
      `,
      [Number(id), userId ?? null],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Proposal not found",
      })
    }

    const r = result.rows[0]

    const proposta = {
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category_name ?? r.category_code,
      categoryColour: r.category_colour ?? undefined,
      status: r.status_name ?? r.status_code,
      statusColour: r.status_colour ?? undefined,
      votes_count: Number(r.vote_count),
      author: r.author_name,
      date: new Date(r.created_at).toLocaleDateString("it-IT"),
      timestamp: new Date(r.created_at).toISOString(),
      isFavourited: Boolean(r.is_favourited),
    }

    res.json({
      data: proposta,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to fetch proposal",
      details: err instanceof Error ? err.message : String(err),
    })
  }
})

router.post("/:id/vota", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user!.sub)

    const proposalId = Number(req.params.id)
    if (!Number.isInteger(proposalId)) {
      return res.status(400).json({
        error: "Invalid proposal id",
      })
    }

    const existsResult = await pool.query(`SELECT 1 FROM proposals WHERE id = $1`, [proposalId])
    if (existsResult.rowCount === 0) {
      return res.status(404).json({
        error: "Proposal not found",
      })
    }

    const { vote } = req.body as { vote?: number }
    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({
        error: "Invalid vote value",
      })
    }

    await pool.query(
      `
      INSERT INTO proposal_votes (user_id, proposal_id, proposal_version, vote_value)
      VALUES ($1, $2, (SELECT current_version FROM proposals WHERE id = $2), $3)
      ON CONFLICT (user_id, proposal_id, proposal_version)
      DO UPDATE SET vote_value = EXCLUDED.vote_value, created_at = NOW()
      `,
      [userId, proposalId, vote],
    )

    const totalResult = await pool.query(
      `
      SELECT COALESCE(SUM(vote_value), 0) AS total
      FROM proposal_votes
      WHERE proposal_id = $1 
        AND proposal_version = (SELECT current_version FROM proposals WHERE id = $1)
      `,
      [proposalId],
    )

    const totalVotes = Number(totalResult.rows[0].total)

    await pool.query(
      `
      UPDATE proposals
      SET vote_value = $1
      WHERE id = $2
      `,
      [totalVotes, proposalId],
    )

    return res.status(200).json({
      success: true, vote, totalVotes,
    })
  } catch (err) {
    console.error("Vote error:", err)
    return res.status(500).json({
      error: "Failed to vote proposal",
    })
  }
})

router.delete("/:id/vota", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user!.sub)

    const proposalId = Number(req.params.id)
    if (!Number.isInteger(proposalId)) {
      return res.status(400).json({
        error: "Invalid proposal id",
      })
    }

    const existsResult = await pool.query(`SELECT 1 FROM proposals WHERE id = $1`, [proposalId])
    if (existsResult.rowCount === 0) {
      return res.status(404).json({
        error: "Proposal not found",
      })
    }

    await pool.query(
      `
      DELETE FROM proposal_votes
      WHERE user_id = $1 
        AND proposal_id = $2 
        AND proposal_version = (SELECT current_version FROM proposals WHERE id = $2)
      `,
      [userId, proposalId],
    )

    const totalResult = await pool.query(
      `
      SELECT COALESCE(SUM(vote_value), 0) AS total
      FROM proposal_votes
      WHERE proposal_id = $1 
        AND proposal_version = (SELECT current_version FROM proposals WHERE id = $1)
      `,
      [proposalId],
    )

    const totalVotes = Number(totalResult.rows[0].total)

    await pool.query(
      `
      UPDATE proposals
      SET vote_value = $1
      WHERE id = $2
      `,
      [totalVotes, proposalId],
    )

    return res.status(200).json({
      success: true, totalVotes,
    })
  } catch (err) {
    console.error("Delete vote error:", err)
    return res.status(500).json({
      error: "Failed to remove vote",
   })
  }
})

router.get("/:id/vota", authenticateToken, async (req: Request, res: Response) => {
  try {
    const proposalId = Number(req.params.id)
    if (!Number.isInteger(proposalId)) {
      return res.status(400).json({
        error: "Invalid proposal id",
      })
    }

    const userId = Number(req.user!.sub)

    const result = await pool.query(
      `
      SELECT vote_value
      FROM proposal_votes
      WHERE user_id = $1 
        AND proposal_id = $2
        AND proposal_version = (SELECT current_version FROM proposals WHERE id = $2)
      `,
      [userId, proposalId],
    )

    if (result.rowCount === 0) {
      return res.status(200).json({
        vote: null,
      })
    }

    const vote = Number(result.rows[0].vote_value)
    return res.status(200).json({
      vote,
    })
  } catch (err) {
    console.error("Get vote error:", err)
    return res.status(500).json({
      error: "Failed to fetch vote",
    })
  }
})

router.post("/:id/preferisco", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user!.sub)

    const proposalId = Number(req.params.id)
    if (!Number.isInteger(proposalId)) {
      return res.status(400).json({
        error: "Invalid proposal id",
      })
    }

    const existsResult = await pool.query(`SELECT 1 FROM proposals WHERE id = $1`, [proposalId])
    if (existsResult.rowCount === 0) {
      return res.status(404).json({
        error: "Proposal not found",
      })
    }

    await pool.query(
      `
      INSERT INTO favourites (user_id, proposal_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, proposal_id) DO NOTHING
      `,
      [userId, proposalId],
    )

    return res.status(200).json({
      success: true,
      isFavourited: true,
    })
  } catch (err) {
    console.error("Add favorite error:", err)
    return res.status(500).json({
      error: "Failed to add favorite",
    })
  }
})

router.delete("/:id/preferisco", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user!.sub)

    const proposalId = Number(req.params.id)
    if (!Number.isInteger(proposalId)) {
      return res.status(400).json({
        error: "Invalid proposal id",
      })
    }

    await pool.query(
      `
      DELETE FROM favourites
      WHERE user_id = $1 AND proposal_id = $2
      `,
      [userId, proposalId],
    )

    return res.status(200).json({
      success: true,
      isFavourited: false,
    })
  } catch (err) {
    console.error("Remove favorite error:", err)
    return res.status(500).json({
      error: "Failed to remove favorite",
    })
  }
})

router.get("/:id/preferisco", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user!.sub)
    const proposalId = Number(req.params.id)
    if (!Number.isInteger(proposalId)) {
      return res.status(400).json({
        error: "Invalid proposal id",
      })
    }

    const result = await pool.query(
      `
      SELECT 1
      FROM favourites
      WHERE user_id = $1 AND proposal_id = $2
      `,
      [userId, proposalId],
    )

    const isFavourited = (result.rowCount ?? 0) > 0
    return res.status(200).json({
      isFavourited,
    })
  } catch (err) {
    console.error("Get favorite error:", err)
    return res.status(500).json({
      error: "Failed to fetch favorite",  
  }
})

export default router