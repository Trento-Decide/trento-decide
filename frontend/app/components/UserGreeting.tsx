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

  if (user) {
    return (
      <div className="mb-5 p-4 rounded-3 shadow-sm bg-white border-start border-5" style={{ borderColor: theme.primary }}>
        <h1 className="fw-bold mb-2">Bentornato, {user.username}! 👋</h1>
        <p className="text-muted mb-3">
          C&apos;è fermento nella tua città. Ecco le ultime novità per te.
        </p>
        <div className="d-flex gap-2">
          <Link href="/proposte/editor" className="btn btn-primary text-white">
            + Crea Proposta
          </Link>
          <Link href="/profilo" className="btn btn-outline-secondary">
            Il mio profilo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-5 py-5 text-center bg-light rounded-3">
      <h1 className="display-5 fw-bold" style={{ color: theme.primary }}>Partecipa alla tua città</h1>
      <p className="fs-5 text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
        La piattaforma digitale per proporre idee, segnalare problemi e votare il futuro del nostro territorio.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link href="/registrati" className="btn btn-primary btn-lg text-white px-4">
          Registrati
        </Link>
        <Link href="/guida" className="btn btn-outline-secondary btn-lg px-4">
          Come funziona
        </Link>
      </div>
    </div>
  )
}
