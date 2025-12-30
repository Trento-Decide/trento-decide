"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { theme } from "@/lib/theme"

import { login } from "@/lib/api"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { ApiError } from "../../../shared/models"

export default function LogIn() {
  const [error, setError] = useState<ApiError | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [activeField, setActiveField] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value

    try {
      await login(email, password)
      router.push("/profilo")
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err)
      } else if (err instanceof Error) {
        setError(new ApiError(err.message))
      } else {
        setError(new ApiError("Si è verificato un errore imprevisto"))
      }
    }
  }

  const inputHeight = "48px"

  const getInputContainerStyle = (fieldName: string) => ({
    height: inputHeight,
    borderRadius: "6px",
    border: activeField === fieldName ? `2px solid ${theme.primary}` : "1px solid #ced4da",
    boxShadow: activeField === fieldName ? "0 0 0 3px rgba(0, 135, 90, 0.1)" : "none",
    transition: "all 0.2s ease-in-out",
    overflow: "hidden",
    display: "flex",
    alignItems: "center"
  })

  return (
    <div className="container py-4 d-flex justify-content-center align-items-center min-vh-100">
      <style jsx>{`
        .link-green {
          color: ${theme.primary} !important;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          transition: text-decoration 0.2s;
        }
        .link-green:hover {
          text-decoration: underline;
        }
        input:focus {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>

      <div className="card border-0 shadow-lg" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
        <div className="card-body p-4">
          <h1 className="h3 fw-bold mb-3 text-dark text-center">Accedi</h1>

          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold small text-dark mb-1">Indirizzo email</label>
              <div style={getInputContainerStyle('email')}>
                <input
                  type="email"
                  className="form-control border-0 h-100 px-3"
                  id="email"
                  name="email"
                  required
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="password" className="form-label fw-bold small text-dark mb-0">Password</label>
                <a href="/password-dimenticata" className="link-green" style={{ fontSize: '0.75rem' }}>
                  Password dimenticata?
                </a>
              </div>
              
              <div style={getInputContainerStyle('password')}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border-0 h-100 px-3" 
                  id="password"
                  name="password"
                  required
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                />
                <button 
                  className="btn bg-white border-0 h-100 pe-3 ps-2 d-flex align-items-center" 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Nascondi password" : "Mostra password"}
                >
                  {showPassword ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash text-secondary" viewBox="0 0 16 16">
                       <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                       <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                       <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                     </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye text-secondary" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <ErrorDisplay error={error} className="mb-3" />}

            <div className="d-grid mb-3">
              <button 
                type="submit" 
                className="btn text-white fw-bold shadow-sm" 
                style={{ backgroundColor: theme.primary, borderRadius: "6px", height: inputHeight }}
              >
                Accedi
              </button>
            </div>

            <div className="text-center mb-3">
              <a href="/registrati" className="link-green">
                Non hai un account? Registrati qui
              </a>
            </div>

            <div className="d-flex align-items-center mb-3">
              <hr className="flex-grow-1 border-secondary opacity-25" />
              <span className="px-2 small text-muted">oppure</span>
              <hr className="flex-grow-1 border-secondary opacity-25" />
            </div>

            <div className="d-flex flex-column align-items-center gap-2">
              
              <button 
                type="button" 
                className="btn text-white d-flex align-items-center p-0 overflow-hidden shadow-sm" 
                style={{ backgroundColor: "#005eb8", borderRadius: "4px", height: inputHeight, width: '85%' }}
              >
                 <div className="d-flex align-items-center justify-content-center h-100" style={{ backgroundColor: "#005eb8", width: inputHeight, borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                    <svg className="icon icon-white" style={{width: '24px', height: '24px'}} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                 </div>
                 <span className="flex-grow-1 text-center fw-bold">Entra con SPID</span>
              </button>

              <button 
                type="button" 
                className="btn text-white d-flex align-items-center p-0 overflow-hidden shadow-sm" 
                style={{ backgroundColor: "#005eb8", borderRadius: "4px", height: inputHeight, width: '85%' }}
              >
                 <div className="d-flex align-items-center justify-content-center h-100" style={{ backgroundColor: "#005eb8", width: inputHeight, borderRight: '1px solid rgba(255,255,255,0.2)' }}>
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