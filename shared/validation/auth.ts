import { z } from "zod"

export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 30,
  hasUpper: /[A-Z]/,
  hasLower: /[a-z]/,
  hasNumber: /[0-9]/,
}

export const loginSchema = z.object({
  email: z.email("Inserisci un'email valida"),
  password: z.string().min(1, "La password è obbligatoria"),
})

export const registerShape = ({
  username: z
    .string()
    .min(3, "Lo username deve avere almeno 3 caratteri")
    .max(20, "Lo username non può superare i 20 caratteri")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo lettere, numeri e underscore"),
  email: z.email("Inserisci un'email valida"),
  password: z
    .string()
    .min(PASSWORD_RULES.minLength, `La password deve essere di almeno ${PASSWORD_RULES.minLength} caratteri`)
    .max(PASSWORD_RULES.maxLength, `La password non può superare i ${PASSWORD_RULES.maxLength} caratteri`)
    .regex(PASSWORD_RULES.hasUpper, "La password deve contenere almeno una lettera maiuscola")
    .regex(PASSWORD_RULES.hasLower, "La password deve contenere almeno una lettera minuscola")
    .regex(PASSWORD_RULES.hasNumber, "La password deve contenere almeno un numero"),
  confirmPassword: z.string().min(1, "Conferma la tua password"),
  emailOptIn: z.boolean().optional(),
})

export const registerSchema = z.object(registerShape)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

export type FieldErrors = Record<string, string>