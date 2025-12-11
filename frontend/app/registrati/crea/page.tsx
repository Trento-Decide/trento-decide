"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"
import { ApiError } from "next/dist/server/api-utils"

import { register } from "@/lib/api"

export default function Accedi() {
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const username = (e.currentTarget.elements.namedItem("username") as HTMLInputElement).value
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value

    try {
      await register(username, email, password)
      // await login(email, password)
      router.push("/accedi")
    } catch (err) {
      if (err instanceof ApiError)
        setError(err.message)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card card-teaser rounded shadow">
            <div className="card-body">
              <h1 className="title-xxxlarge mb-5">Registrati</h1>
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                <div className="form-group mb-5">
                  <label htmlFor="text" className="active">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    required
                  />
                </div>

                <div className="form-group mb-5">
                  <label htmlFor="email" className="active">
                    Indirizzo email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <div className="d-flex justify-content-between align-items-baseline flex-nowrap mb-1">
                    <label htmlFor="password" className="active mb-0">
                      Password
                    </label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      required
                    />
                  </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-grid mt-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    {"Registrati"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
