"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { theme } from "@/lib/theme"
import { login } from "@/lib/api"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { ApiError } from "../../../shared/models"
import { loginSchema, type FieldErrors } from "../../../shared/validation/auth"

import AuthInput from "@/app/components/AuthInput"

export default function LogIn() {
  const router = useRouter()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [apiError, setApiError] = useState<ApiError | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isFormValid = loginSchema.safeParse(formData).success

  const validateSingleField = (name: string, value: string) => {
    const fieldName = name as keyof typeof loginSchema.shape

    const fieldValidator = loginSchema.shape[fieldName]

    const result = fieldValidator.safeParse(value)

    setFieldErrors(prev => {
      const newErrors = { ...prev }
      if (result.success) {
        delete newErrors[name]
      } else {
        newErrors[name] = result.error.issues[0].message
      }
      return newErrors
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (fieldErrors[name]) {
      validateSingleField(name, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid) return

    setApiError(null)

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const errors: FieldErrors = {}
      result.error.issues.forEach(issue => errors[issue.path[0] as string] = issue.message)
      setFieldErrors(errors)
      return
    }

    try {
      await login(formData.email, formData.password)
      router.push("/profilo")
    } catch (err: unknown) {
      if (err instanceof ApiError) setApiError(err)
      else if (err instanceof Error) setApiError(new ApiError(err.message))
      else setApiError(new ApiError("Si è verificato un errore imprevisto"))
    }
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <style jsx>{`
        .link-green { color: ${theme.primary} !important; text-decoration: none; font-weight: 700; font-size: 0.85rem; }
        .link-green:hover { text-decoration: underline; }
      `}</style>

      <div className="card border-0 shadow-lg" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
        <div className="card-body p-3">
          <h1 className="h3 fw-bold mb-3 text-dark text-center pt-2">Accedi</h1>

          <form onSubmit={handleSubmit} noValidate>

            <AuthInput
              label="Indirizzo email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={(e) => validateSingleField(e.target.name, e.target.value)}
              error={fieldErrors.email}
              required
            />

            <div className="mb-3">
              <div style={{ position: 'relative' }}>
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
              </div>
            </div>

            {apiError && <ErrorDisplay error={apiError} className="mb-3" />}

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn text-white fw-bold shadow-sm"
                disabled={!isFormValid}
                style={{
                  backgroundColor: isFormValid ? theme.primary : "#cccccc",
                  borderRadius: "6px",
                  height: "48px",
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  opacity: isFormValid ? 1 : 0.8
                }}
              >
                Accedi
              </button>
            </div>

            <div className="d-flex align-items-center mb-3">
              <hr className="flex-grow-1 border-secondary opacity-25" />
              <span className="px-2 small text-muted">oppure</span>
              <hr className="flex-grow-1 border-secondary opacity-25" />
            </div>

            <div className="d-flex flex-column align-items-center gap-2">
              <button type="button" className="btn text-white d-flex align-items-center p-0 overflow-hidden shadow-sm" style={{ backgroundColor: "#005eb8", borderRadius: "4px", height: "48px", width: '85%' }}>
                <div className="d-flex align-items-center justify-content-center h-100" style={{ backgroundColor: "#005eb8", width: "48px", borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                  <svg className="icon icon-white" style={{ width: '24px', height: '24px' }} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="flex-grow-1 text-center fw-bold">Entra con SPID</span>
              </button>
              <button type="button" className="btn text-white d-flex align-items-center p-0 overflow-hidden shadow-sm" style={{ backgroundColor: "#005eb8", borderRadius: "4px", height: "48px", width: '85%' }}>
                <div className="d-flex align-items-center justify-content-center h-100" style={{ backgroundColor: "#005eb8", width: "48px", borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="d-flex flex-column align-items-center justify-content-center lh-1">
                    <span className="fw-bold" style={{ fontSize: '11px' }}>Cie</span>
                    <span className="fw-bold" style={{ fontSize: '11px' }}>ID</span>
                  </div>
                </div>
                <span className="flex-grow-1 text-center fw-bold">Entra con CIE</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}