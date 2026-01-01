import { z } from "zod"
import type { FormField } from "../models.js"

const localizedText = z.record(z.string(), z.string())

const baseField = z.object({
  kind: z.enum(["text", "number", "boolean", "select", "multiselect", "date", "map", "file"]),
  key: z.string().min(1),
  label: localizedText,
  required: z.boolean().optional(),
  helpText: localizedText.optional(),
})

export const categoryFormSchema = z.array(
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