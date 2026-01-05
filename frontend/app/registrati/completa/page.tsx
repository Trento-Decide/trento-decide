"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { theme } from "@/lib/theme"
import { register } from "@/lib/api"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { ApiError } from "../../../../shared/models"
import { registerSchema, registerShape, type FieldErrors, PASSWORD_RULES } from "../../../../shared/validation/auth"

import AuthInput from "@/app/components/AuthInput"
import PasswordChecklist from "@/app/components/PasswordChecklist"

export default function RegistrazioneCompleta() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "", emailOptIn: true
  })
  const [apiError, setApiError] = useState<ApiError | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [validFields, setValidFields] = useState<Record<string, boolean>>({})
  const [pwdCriteria, setPwdCriteria] = useState({ length: false, upper: false, lower: false, number: false })

  const isFormValid = registerSchema.safeParse(formData).success

  const validateSingleField = (name: string, value: string | boolean) => {
    if (name === 'emailOptIn') return

    if (name === 'confirmPassword') {
      const isValid = (value as string) === formData.password && (value as string).length > 0
      setFieldErrors(prev => {
        const newErr = { ...prev }
        if (isValid) delete newErr.confirmPassword
        else if ((value as string).length > 0) newErr.confirmPassword = "Le password non coincidono"
        return newErr
      })
      setValidFields(prev => ({ ...prev, confirmPassword: isValid }))
      return
    }

    const fieldDef = registerShape[name as keyof typeof registerShape]
    if (fieldDef) {
      const result = fieldDef.safeParse(value)
      setFieldErrors(prev => {
        const newErr = { ...prev }
        if (result.success) {
          delete newErr[name]
        } else {
          newErr[name] = result.error.issues[0].message
        }
        return newErr
      })
      setValidFields(prev => ({ ...prev, [name]: result.success && String(value).length > 0 }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const val = type === "checkbox" ? checked : value

    setFormData(prev => ({ ...prev, [name]: val }))

    if (name === "password") {
      const pwd = value as string
      setPwdCriteria({
        length: pwd.length >= PASSWORD_RULES.minLength && pwd.length <= PASSWORD_RULES.maxLength,
        upper: PASSWORD_RULES.hasUpper.test(pwd),
        lower: PASSWORD_RULES.hasLower.test(pwd),
        number: PASSWORD_RULES.hasNumber.test(pwd),
      })
      if (formData.confirmPassword) {
         const matches = pwd === formData.confirmPassword
         setValidFields(prev => ({ ...prev, confirmPassword: matches }))
         
         setFieldErrors(prev => {
           const newErr = { ...prev }
           if (matches) {
             delete newErr.confirmPassword
           } else {
             newErr.confirmPassword = "Le password non coincidono"
           }
           return newErr
         })
      }
      if (fieldErrors.password) validateSingleField("password", pwd)
    } else if (name === "confirmPassword" || fieldErrors[name]) {
      validateSingleField(name, val as string)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid) return 
    setApiError(null)

    const result = registerSchema.safeParse(formData)
    if (!result.success) {
      const errors: FieldErrors = {}
      result.error.issues.forEach(issue => errors[issue.path[0] as string] = issue.message)
      setFieldErrors(errors)
      return
    }

    try {
      await register(formData.username, formData.email, formData.password, formData.confirmPassword, formData.emailOptIn)
      router.push("/accedi")
    } catch (err: unknown) {
      if (err instanceof ApiError) setApiError(err)
      else if (err instanceof Error) setApiError(new ApiError(err.message))
    }
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <style jsx>{`
        .link-green { color: ${theme.primary} !important; text-decoration: none; font-weight: 700; font-size: 0.85rem; }
        .link-green:hover { text-decoration: underline; }
        .form-check-input:checked { background-color: ${theme.primary}; border-color: ${theme.primary}; }
      `}</style>

      <div className="card border-0 shadow-lg" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
        <div className="card-body p-3">
          <h1 className="h3 fw-bold mb-3 text-dark text-center pt-2">Registrati</h1>

          <form onSubmit={handleSubmit} noValidate>
            
            <AuthInput 
              label="Nome utente"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={(e) => validateSingleField(e.target.name, e.target.value)}
              error={fieldErrors.username}
              isValid={validFields.username}
              required
            />

            <AuthInput 
              label="Indirizzo email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={(e) => validateSingleField(e.target.name, e.target.value)}
              error={fieldErrors.email}
              isValid={validFields.email}
              required
            />

            <div className="mb-3">
              <AuthInput 
                label="Password"
                name="password"
                isPassword
                value={formData.password}
                onChange={handleChange}
                onBlur={(e) => validateSingleField(e.target.name, e.target.value)}
                error={fieldErrors.password}
                required
              />
              {(formData.password.length > 0) && (
                 <PasswordChecklist criteria={pwdCriteria} />
              )}
            </div>

            <AuthInput 
              label="Conferma Password"
              name="confirmPassword"
              isPassword
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={(e) => validateSingleField(e.target.name, e.target.value)}
              error={fieldErrors.confirmPassword}
              isValid={validFields.confirmPassword}
              required
            />

            <div className="mb-3 d-flex align-items-start">
               <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="emailOptIn" name="emailOptIn" 
                    checked={formData.emailOptIn} onChange={handleChange} style={{ cursor: 'pointer' }} />
                  <label className="form-check-label text-muted lh-sm small" htmlFor="emailOptIn" style={{ cursor: 'pointer', marginTop: '3px' }}>
                    Voglio ricevere aggiornamenti su nuove proposte e sondaggi nella mia zona.
                  </label>
               </div>
            </div>

            {apiError && <ErrorDisplay error={apiError} className="mb-3" />}

            <div className="d-grid mb-3">
              <button type="submit" className="btn text-white fw-bold shadow-sm" disabled={!isFormValid}
                style={{ backgroundColor: isFormValid ? theme.primary : "#ccc", borderRadius: "6px", height: "48px" }}>
                Registrati
              </button>
            </div>

            <div className="text-center mb-2">
              <span className="small text-muted me-1">Hai già un account?</span>
              <Link href="/accedi" className="link-green">Accedi qui</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}