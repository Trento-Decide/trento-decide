import { pool } from "../database.js"
import type { FormField, ProposalInput } from "../../../shared/models.js"
import { categoryFormSchema, buildAdditionalDataSchema } from "../../../shared/validation/forms.js"

export async function loadFormSchemaByCategoryId(categoryId: number): Promise<FormField[]> {
  const { rows } = await pool.query(`SELECT form_schema FROM categories WHERE id = $1`, [categoryId])
  if (rows.length === 0) throw new Error("Categoria non trovata")
  return categoryFormSchema.parse(rows[0].form_schema ?? []) as FormField[]
}

async function validateAdditionalDataByCategoryId(categoryId: number, additionalData: unknown, isDraft: boolean) {
  const fields = await loadFormSchemaByCategoryId(categoryId)
  const zodSchema = buildAdditionalDataSchema(fields, isDraft)
  return zodSchema.parse(additionalData ?? {})
}

async function validateRequiredFilesByCategoryId(categoryId: number, proposalId: number) {
  const fields = await loadFormSchemaByCategoryId(categoryId)
  const requiredSlots = fields.filter(f => f.kind === "file" && f.required).map(f => f.key)
  if (requiredSlots.length === 0) return

  const { rows } = await pool.query(
    `SELECT slot_key, COUNT(*)::int AS cnt
     FROM attachments
     WHERE proposal_id = $1 AND slot_key IS NOT NULL
     GROUP BY slot_key`,
    [proposalId],
  )
  const map = new Map<string, number>(rows.map(r => [r.slot_key as string, r.cnt as number]))
  const missing = requiredSlots.filter(k => (map.get(k) ?? 0) < 1)

  if (missing.length > 0) {
    const err = new Error("Missing required file attachments")
    ;(err as Error & { details: { missing: string[] } }).details = { missing }
    throw err
  }
}

export async function validateProposalInput(
  input: ProposalInput,
  options?: { context?: 'draft' | 'update' | 'publish'; proposalId?: number }
) {
  const ctx = options?.context ?? 'draft'

  const { title, description, additionalData, categoryId } = input

  if (title !== undefined && typeof title !== 'string') {
    throw new Error('Title must be a string')
  }

  if (description !== undefined && typeof description !== 'string') {
    throw new Error('Description must be a string')
  }

  if (ctx === 'draft') {
    if (!title) {
      throw new Error('Title required')
    }
  }

  if (ctx === 'update' || ctx === 'publish') {
    if (categoryId === undefined) {
      throw new Error('Category ID required')
    }
    if (!title || (typeof title === 'string' && title.length < 5)) {
      throw new Error('Title too short')
    }
    if (!description || (typeof description === 'string' && description.length < 10)) {
      throw new Error('Description too short')
    }
    if (additionalData === undefined) {
      throw new Error('Additional data required')
    }
  }

  if (additionalData !== undefined && categoryId !== undefined) {
    const isDraft = ctx === 'draft';
    await validateAdditionalDataByCategoryId(categoryId, additionalData, isDraft)
  }

  if (ctx === 'publish' && options?.proposalId !== undefined) {
    if (categoryId === undefined) {
      throw new Error('Category ID required')
    }
    await validateRequiredFilesByCategoryId(categoryId, options.proposalId)
  }

  return true
}
