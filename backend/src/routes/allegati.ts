import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { authenticateToken } from "../middleware/authMiddleware.js"
import type { Attachment, AttachmentCreateInput, FileField } from "../../../shared/models.js"
import { z } from "zod"

const router = express.Router()

const attachBodySchema = z.object({
  fileUrl: z.string().min(1),
  fileType: z.string().optional(),
  fileName: z.string().optional(),
})

router.post(
  "/proposte/:id/allegati/:slotKey",
  authenticateToken,
  async (req: Request<{ id: string; slotKey: string }, unknown, AttachmentCreateInput>, res: Response) => {
    const userId = Number(req.user!.sub)
    const proposalId = Number(req.params.id)
    const slotKey = req.params.slotKey

    if (!Number.isInteger(proposalId)) return res.status(400).json({ error: "Invalid proposal id" })

    const parsed = attachBodySchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: "Invalid body: fileUrl is required" })
    const { fileUrl, fileType, fileName } = parsed.data

    try {
      const catRes = await pool.query(
        `SELECT c.form_schema, p.author_id
         FROM proposals p
         JOIN categories c ON c.id = p.category_id
         WHERE p.id = $1`,
        [proposalId],
      )

      if (catRes.rowCount === 0) return res.status(404).json({ error: "Proposal not found" })
      
      const proposal = catRes.rows[0]
      
      if (proposal.author_id !== userId) {
        return res.status(403).json({ error: "You are not the author of this proposal" })
      }

      const formSchema = Array.isArray(proposal.form_schema) ? proposal.form_schema : []
      
      const fieldDef = formSchema.find(
        (f: Record<string, unknown>) => f.kind === "file" && f.key === slotKey
      ) as FileField | undefined

      if (!fieldDef) {
        return res.status(400).json({ error: `Invalid slotKey '${slotKey}' for this category` })
      }

      const countRes = await pool.query(
        `SELECT COUNT(*)::int as total FROM attachments WHERE proposal_id = $1 AND slot_key = $2`,
        [proposalId, slotKey]
      )
      const currentCount = countRes.rows[0].total

      const isMultiple = fieldDef.multiple === true
      const maxFiles = fieldDef.maxFiles ?? (isMultiple ? 5 : 1)

      if (currentCount >= maxFiles) {
        return res.status(400).json({ 
          error: `Limit reached. Max ${maxFiles} files allowed for slot '${slotKey}'` 
        })
      }

      const insert = await pool.query(
        `INSERT INTO attachments (proposal_id, file_url, file_type, file_name, slot_key)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, uploaded_at`,
        [proposalId, fileUrl, fileType ?? null, fileName ?? null, slotKey],
      )

      const resp: Attachment = {
        id: insert.rows[0].id,
        proposalId,
        fileUrl,
        fileType,
        fileName,
        uploadedAt: new Date(insert.rows[0].uploaded_at).toISOString(),
        slotKey,
      }
      return res.status(201).json(resp)

    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Database error" })
    }
  },
)

router.post(
  "/proposte/:id/allegati",
  authenticateToken,
  async (req: Request<{ id: string }, unknown, AttachmentCreateInput>, res: Response) => {
    const userId = Number(req.user!.sub)
    const proposalId = Number(req.params.id)
    if (!Number.isInteger(proposalId)) return res.status(400).json({ error: "Invalid proposal id" })

    const parsed = attachBodySchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: "Invalid body" })
    const { fileUrl, fileType, fileName } = parsed.data

    try {
      const pCheck = await pool.query(`SELECT author_id FROM proposals WHERE id = $1`, [proposalId])
      if (pCheck.rowCount === 0) return res.status(404).json({ error: "Proposal not found" })
      if (pCheck.rows[0].author_id !== userId) return res.status(403).json({ error: "Not authorized" })

      const insert = await pool.query(
        `INSERT INTO attachments (proposal_id, file_url, file_type, file_name, slot_key)
         VALUES ($1, $2, $3, $4, NULL)
         RETURNING id, uploaded_at`,
        [proposalId, fileUrl, fileType ?? null, fileName ?? null],
      )

      const resp: Attachment = {
        id: insert.rows[0].id,
        proposalId,
        fileUrl,
        fileType,
        fileName,
        uploadedAt: new Date(insert.rows[0].uploaded_at).toISOString(),
      }
      return res.status(201).json(resp)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Internal error" })
    }
  },
)

router.get("/proposte/:id/allegati", authenticateToken, async (req: Request<{ id: string }>, res: Response) => {
  const proposalId = Number(req.params.id)
  if (!Number.isInteger(proposalId)) return res.status(400).json({ error: "Invalid proposal id" })

  try {
    const { rows } = await pool.query(
      `SELECT id, proposal_id, file_url, file_type, file_name, uploaded_at, slot_key
       FROM attachments
       WHERE proposal_id = $1
       ORDER BY uploaded_at DESC`,
      [proposalId],
    )

    const formFiles: Record<string, Attachment[]> = {}
    const extraAttachments: Attachment[] = []

    for (const r of rows) {
      const item: Attachment = {
        id: r.id,
        proposalId: r.proposal_id,
        fileUrl: r.file_url,
        fileType: r.file_type ?? undefined,
        fileName: r.file_name ?? undefined,
        uploadedAt: new Date(r.uploaded_at).toISOString(),
        slotKey: r.slot_key ?? undefined,
      }
      if (r.slot_key) {
        if (!formFiles[r.slot_key]) formFiles[r.slot_key] = []
        formFiles[r.slot_key]!.push(item)
      } else {
        extraAttachments.push(item)
      }
    }

    return res.json({ formFiles, extraAttachments })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to fetch attachments" })
  }
})

router.delete("/allegati/:id", authenticateToken, async (req: Request<{ id: string }>, res: Response) => {
  const userId = Number(req.user!.sub)
  const attachmentId = Number(req.params.id)
  if (!Number.isInteger(attachmentId)) return res.status(400).json({ error: "Invalid attachment id" })

  try {
    const del = await pool.query(
      `DELETE FROM attachments 
       USING proposals 
       WHERE attachments.id = $1 
         AND attachments.proposal_id = proposals.id
         AND proposals.author_id = $2
       RETURNING attachments.id`,
      [attachmentId, userId]
    )

    if (del.rowCount === 0) {
      return res.status(404).json({ error: "Attachment not found or not authorized" })
    }

    return res.status(204).send()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to delete attachment" })
  }
})

export default router