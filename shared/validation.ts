import { z } from "zod"

const localizedText = z.record(z.string(), z.string())

const baseField = z.object({
  kind: z.enum(["text","number","boolean","select","multiselect","date","map","file"]),
  key: z.string().min(1),
  label: localizedText.or(z.object({ it: z.string() })),
  required: z.boolean().optional(),
  helpText: localizedText.optional(),
})

const fieldSchema = z.discriminatedUnion("kind", [
  baseField.extend({ kind: z.literal("text"), minLength: z.number().int().nonnegative().optional(), maxLength: z.number().int().positive().optional(), pattern: z.string().optional() }),
  baseField.extend({ kind: z.literal("number"), min: z.number().optional(), max: z.number().optional(), step: z.number().positive().optional(), unit: z.string().optional() }),
  baseField.extend({ kind: z.literal("boolean") }),
  baseField.extend({ kind: z.literal("select"), options: z.array(z.object({ value: z.string(), label: localizedText })).min(1) }),
  baseField.extend({ kind: z.literal("multiselect"), options: z.array(z.object({ value: z.string(), label: localizedText })).min(1) }),
  baseField.extend({ kind: z.literal("date"), min: z.string().optional(), max: z.string().optional() }),
  baseField.extend({ kind: z.literal("map"), schema: z.record(z.string(), z.unknown()).optional() }),
  baseField.extend({ kind: z.literal("file"), accept: z.array(z.string()).optional(), maxSizeMB: z.number().positive().optional() }),
])

export const categoryFormSchema = z.array(fieldSchema)

export function buildAdditionalDataSchema(formSchema: unknown) {
  const parsed = categoryFormSchema.parse(Array.isArray(formSchema) ? formSchema : [])
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const f of parsed) {
    const required = f.required === true
    let s: z.ZodTypeAny
    switch (f.kind) {
      case "text":
        s = z.string()
        if (f.minLength) s = s.min(f.minLength)
        if (f.maxLength) s = s.max(f.maxLength)
        if (f.pattern) s = s.regex(new RegExp(f.pattern))
        break
      case "number":
        s = z.number()
        if (typeof f.min === "number") s = s.min(f.min)
        if (typeof f.max === "number") s = s.max(f.max)
        break
      case "boolean":
        s = z.boolean()
        break
      case "select":
        s = z.enum(f.options.map(o => o.value) as [string, ...string[]])
        break
      case "multiselect":
        s = z.array(z.enum(f.options.map(o => o.value) as [string, ...string[]]))
        break
      case "date":
        s = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
        break
      case "map":
        s = z.record(z.string(), z.unknown())
        break
      case "file":
        s = z.record(z.string(), z.unknown())
        break
      default:
        s = z.unknown()
    }
    shape[f.key] = required ? s : s.optional()
  }

  return z.object(shape).strict()
}