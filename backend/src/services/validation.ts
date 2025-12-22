import { pool } from "../database.js"
import { z } from "zod"

export type LocalizedText = Record<string, string>

type BaseField = {
  kind: "text" | "number" | "boolean" | "select" | "multiselect" | "date" | "map" | "file"
  key: string
  label: LocalizedText
  required?: boolean | undefined
  helpText?: LocalizedText | undefined
}

type TextField = BaseField & { kind: "text"; minLength?: number | undefined; maxLength?: number | undefined; pattern?: string | undefined }
type NumberField = BaseField & { kind: "number"; min?: number | undefined; max?: number | undefined; step?: number | undefined; unit?: string | undefined }
type BooleanField = BaseField & { kind: "boolean" }
type SelectField = BaseField & { kind: "select"; options: Array<{ value: string; label: LocalizedText }> }
type MultiSelectField = BaseField & { kind: "multiselect"; options: Array<{ value: string; label: LocalizedText }> }
type DateField = BaseField & { kind: "date"; min?: string | undefined; max?: string | undefined }
type MapField = BaseField & { kind: "map"; geoSchema?: unknown | undefined }
type FileField = BaseField & { kind: "file"; accept?: string[] | undefined; multiple?: boolean | undefined; maxFiles?: number | undefined; maxSizeMB?: number | undefined }

type FormField = TextField | NumberField | BooleanField | SelectField | MultiSelectField | DateField | MapField | FileField

const localizedText = z.record(z.string(), z.string())
const baseField = z.object({
  kind: z.enum(["text", "number", "boolean", "select", "multiselect", "date", "map", "file"]),
  key: z.string().min(1),
  label: localizedText,
  required: z.boolean().optional(),
  helpText: localizedText.optional(),
})

const categoryFormSchema = z.array(
  z.discriminatedUnion("kind", [
    baseField.extend({ kind: z.literal("text"), minLength: z.number().int().nonnegative().optional(), maxLength: z.number().int().positive().optional(), pattern: z.string().optional() }),
    baseField.extend({ kind: z.literal("number"), min: z.number().optional(), max: z.number().optional(), step: z.number().positive().optional(), unit: z.string().optional() }),
    baseField.extend({ kind: z.literal("boolean") }),
    baseField.extend({ kind: z.literal("select"), options: z.array(z.object({ value: z.string(), label: localizedText })).min(1) }),
    baseField.extend({ kind: z.literal("multiselect"), options: z.array(z.object({ value: z.string(), label: localizedText })).min(1) }),
    baseField.extend({ kind: z.literal("date"), min: z.string().optional(), max: z.string().optional() }),
    baseField.extend({ kind: z.literal("map"), geoSchema: z.unknown().optional() }),
    baseField.extend({ kind: z.literal("file"), accept: z.array(z.string()).optional(), multiple: z.boolean().optional(), maxFiles: z.number().int().positive().optional(), maxSizeMB: z.number().int().positive().optional() }),
  ]),
)

export async function loadFormSchemaByCategoryId(categoryId: number): Promise<FormField[]> {
  const { rows } = await pool.query(`SELECT form_schema FROM categories WHERE id = $1`, [categoryId])
  if (rows.length === 0) throw new Error("Categoria non trovata")
  return categoryFormSchema.parse(rows[0].form_schema ?? []) as FormField[]
}

export function buildAdditionalDataSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}
  
  for (const f of fields) {
    const required = f.required === true
    if (f.kind === "file") continue 

    let fieldSchema: z.ZodTypeAny

    switch (f.kind) {
      case "text": {
        let s = z.string()
        if (f.minLength !== undefined) s = s.min(f.minLength)
        if (f.maxLength !== undefined) s = s.max(f.maxLength)
        if (f.pattern !== undefined) s = s.regex(new RegExp(f.pattern))
        fieldSchema = s
        break
      }
      case "number": {
        let s = z.number()
        if (f.min !== undefined) s = s.min(f.min)
        if (f.max !== undefined) s = s.max(f.max)
        fieldSchema = s
        break
      }
      case "boolean": {
        fieldSchema = z.boolean()
        break
      }
      case "select": {
        const values = f.options.map(o => o.value)
        fieldSchema = values.length > 0 
            ? z.enum(values as [string, ...string[]]) 
            : z.string()
        break
      }
      case "multiselect": {
        const values = f.options.map(o => o.value)
        fieldSchema = values.length > 0 
            ? z.array(z.enum(values as [string, ...string[]]))
            : z.array(z.string())
        break
      }
      case "date": {
        fieldSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
        break
      }
      case "map": {
        fieldSchema = z.record(z.string(), z.unknown())
        break
      }
      default: {
        fieldSchema = z.unknown()
      }
    }
    
    shape[f.key] = required ? fieldSchema : fieldSchema.optional()
  }
  
  return z.object(shape).strict()
}

export async function validateAdditionalDataByCategoryId(categoryId: number, additionalData: unknown) {
  const fields = await loadFormSchemaByCategoryId(categoryId)
  const zodSchema = buildAdditionalDataSchema(fields)
  return zodSchema.parse(additionalData ?? {})
}

export async function validateRequiredFilesByCategoryId(categoryId: number, proposalId: number) {
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