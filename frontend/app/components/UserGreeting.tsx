"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getUserData } from "@/lib/local"
import { theme } from "@/lib/theme"
import type { User } from "../../../shared/models"

export default function UserGreeting() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const update = () => {
      const user = getUserData()
      if (user) setUser(user)
      else setUser(null)
    }

    update()

    window.addEventListener("authChange", update)
    return () => window.removeEventListener("authChange", update)
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="mb-5 p-4 rounded-3 shadow-sm border-0 position-relative overflow-hidden"
      style={{ backgroundColor: 'white' }}>

      <div
        className="position-absolute top-0 start-0 h-100 w-100"
        style={{
          background: `linear-gradient(90deg, ${theme.primary}15 0%, rgba(255,255,255,0) 100%)`,
          zIndex: 0
        }}
      />

      <div className="position-relative d-md-flex align-items-center justify-content-between" style={{ zIndex: 1 }}>
        <div className="mb-3 mb-md-0">
          <h1 className="h3 fw-bold mb-1" style={{ color: '#1a1a1a' }}>
            Bentornato, {user.username}! <span className="fs-4">👋</span>
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            Ci sono nuove proposte che aspettano il tuo voto.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link
            href="/profilo"
            className="btn btn-outline-secondary fw-semibold px-3"
            style={{ fontSize: '0.9rem', borderWidth: '1px' }}
          >
            Il mio profilo
          </Link>

          <Link
            href="/proposte/nuova"
            className="btn text-white fw-bold px-3 d-flex align-items-center gap-2 shadow-sm"
            style={{ backgroundColor: theme.primary, border: 'none', fontSize: '0.9rem' }}
          >
            <svg className="icon icon-white bg-transparent" aria-hidden="true" style={{ width: 18, height: 18 }}>
              <use href="/svg/sprites.svg#it-plus"></use>
            </svg>
            Crea Proposta
          </Link>
        </div>
      </div>
    </div>
  )
}