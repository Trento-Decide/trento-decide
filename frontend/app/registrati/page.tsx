"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"
import { ApiError } from "next/dist/server/api-utils"

import { providerLogin } from "@/lib/api"

export default function Registrati() {
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleProviderLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      await providerLogin()
      router.push("/registrati/crea")
    } catch (err) {
      if (err instanceof ApiError)
        setError(err.message)
    }
  }

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
