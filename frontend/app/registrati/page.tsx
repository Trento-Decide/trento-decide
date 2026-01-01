"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { providerLogin } from "@/lib/api"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { ApiError } from "../../../shared/models"

export default function Registrati() {
  const [error, setError] = useState<ApiError | null>(null)
  const router = useRouter()

  const handleProviderLogin = async () => {
    try {
      await providerLogin()
      router.push("/registrati/completa")
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err)
      } else if (err instanceof Error) {
        setError(new ApiError(err.message))
      }
    }
  }

  return (
    <div className="container py-5">
      {error && (
        <div className="mb-4">
          <ErrorDisplay error={error} />
        </div>
      )}

      <div className="row justify-content-start">
        <div className="col-12 col-md-10 col-lg-8">
          
          <h1 className="fw-bold display-5 mb-3">Registrati</h1>
          <p className="text-muted">
            Per accedere al sito e i suoi servizi accedi con SPID o CIE
          </p>
          
          <hr className="my-4" />
          
          <h5 className="fw-bold mb-2">SPID / CIE</h5>
          <p className="text-muted mb-4">
            Accedi con la tua identità digitale
          </p>
          
          <div className="d-flex flex-wrap gap-3">
            
            <button 
              type="button" 
              className="btn text-white d-flex align-items-center p-0 overflow-hidden shadow-sm" 
              onClick={handleProviderLogin}
              style={{ backgroundColor: "#005eb8", borderRadius: "4px", height: "48px", width: '220px' }}
            >
               <div className="d-flex align-items-center justify-content-center h-100" style={{ backgroundColor: "#005eb8", width: "48px", borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                  <svg className="icon icon-white" style={{width: '24px', height: '24px'}} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
               </div>
               <span className="flex-grow-1 text-center fw-bold">Login with SPID</span>
            </button>

            <button 
              type="button" 
              className="btn text-white d-flex align-items-center p-0 overflow-hidden shadow-sm" 
              onClick={handleProviderLogin}
              style={{ backgroundColor: "#005eb8", borderRadius: "4px", height: "48px", width: '220px' }}
            >
               <div className="d-flex align-items-center justify-content-center h-100" style={{ backgroundColor: "#005eb8", width: "48px", borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="d-flex flex-column align-items-center justify-content-center lh-1">
                     <span className="fw-bold" style={{ fontSize: '11px' }}>Cie</span>
                     <span className="fw-bold" style={{ fontSize: '11px' }}>ID</span>
                  </div>
               </div>
               <span className="flex-grow-1 text-center fw-bold">Login with CIE</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}