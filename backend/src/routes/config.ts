import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { loadFormSchemaByCategoryId } from "../services/validation.js"

import type { Category, FormField } from "../../../shared/models.js"

type DBCategoryRow = {
  id: number
  code: string
  labels: Record<string, string> | null
  description?: Record<string, string> | null
  colour?: string | null
  form_schema?: unknown
}

const router = express.Router()

router.get(
  "/categories",
  async (_req: Request, res: Response<{ data: Category[] } | { error: string }>) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, code, labels, description, colour, form_schema FROM categories ORDER BY id`
      )

      const data: Category[] = rows.map((r: DBCategoryRow) => ({
        id: r.id,
        code: r.code,
        labels: r.labels ?? {},
        ...(r.description ? { description: r.description } : {}),
        ...(r.colour ? { colour: r.colour } : {}),
        formSchema: Array.isArray(r.form_schema) ? r.form_schema : [],
      }))

      return res.json({ data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Failed to fetch categories" })
    }
  },
)

router.get(
  "/categories/:id/form",
  async (req: Request<{ id: string }>, res: Response<{ data: FormField[] } | { error: string }>) => {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid ID" })

      const fields = await loadFormSchemaByCategoryId(id)
      return res.json({ data: fields })
    } catch (err) {
      console.error(err)
      return res.status(404).json({ error: "Category not found" })
    }
  },
)

export default router
