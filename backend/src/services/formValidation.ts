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

  return true
}

