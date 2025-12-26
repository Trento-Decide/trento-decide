"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { providerLogin } from "@/lib/api"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { ApiError } from "../../../shared/models"

export default function Registrati() {
  const [error, setError] = useState<ApiError | null>(null)

  const router = useRouter()

  const handleProviderLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      await providerLogin()
      router.push("/registrati/crea")
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err)
      } else if (err instanceof Error) {
        setError(new ApiError(err.message))
      }
    }
  }

  if (error) return (
    <div className="container my-4">
      <ErrorDisplay error={error} />
    </div>
  )

  return (
    <div className="container py-5">
      <div className="row justify-content-left">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="title-xxxlarge mb-3">Registrati</h1>
          <p>Per accedere al sito e i suoi servizi accedi con SPID o CIE</p>
          <hr />
          <h5>SPID / CIE</h5>
          <p>Accedi con la tua identità digitale</p>
          <div className="d-flex flex-row align-items-center gap-3">
            <button type="submit" className="btn btn-primary btn-re d-flex gap-3" onClick={handleProviderLogin}>
              <svg className="icon icon-white" aria-hidden="true">
                <use href="/svg/spid.svg"></use>
              </svg>
              <span>Login with SPID</span>
            </button>
            <button type="submit" className="btn btn-primary btn-re d-flex gap-3" onClick={handleProviderLogin}>
              <svg className="icon icon-white" aria-hidden="true">
                <use href="/svg/cie.svg"></use>
              </svg>
              <span>Login with CIE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
