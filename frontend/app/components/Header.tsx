"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getUserData, logout } from "@/lib/local"

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const update = () => {
      const user = getUserData()
      if (user) {
        setUserName(user.first)
      } else {
        setUserName(null)
      }
    }

    update()
    window.addEventListener("authChange", update)
    return () => window.removeEventListener("authChange", update)
  }, [])

  useEffect(() => {
    const q = searchParams?.get("q") ?? ""
    setSearch(q)
  }, [searchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (!q) return
    router.push(`/cerca?q=${encodeURIComponent(q)}`)
  }

  const isActive = (href: string) => pathname?.startsWith(href)

  return (
    <header className="it-header-wrapper">
      <div className="it-header-slim-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-header-slim-wrapper-content">
                <a
                  className="d-none d-lg-block navbar-brand"
                  target="_blank"
                  rel="noopener"
                  href="https://www.comune.trento.it/"
                >
                  Comune di Trento
                </a>

                <div className="it-header-slim-right-zone" role="navigation">
                  {userName ? (
                    <div className="nav-item dropdown">
                      <button
                        className="btn btn-light dropdown-toggle d-flex align-items-center gap-2 px-3 py-1 header-user-btn"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        type="button"
                      >
                        <span
                          className="rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{
                            width: 28,
                            height: 28,
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            backgroundColor: "#ff4b8b",
                            color: "#ffffff",
                          }}
                        >
                          {userName.charAt(0).toUpperCase()}
                        </span>
                        <span className="d-none d-lg-block text-lowercase header-username">
                          {userName}
                        </span>
                        <svg className="icon icon-sm">
                          <use href="/svg/sprites.svg#it-expand"></use>
                        </svg>
                      </button>

                      <div className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <div className="row">
                          <div className="col-12">
                            <div className="link-list-wrapper">
                              <ul className="link-list">
                                <li>
                                  <Link className="list-item left-icon text-nowrap" href="/profilo">
                                    <svg className="icon icon-sm icon-primary left">
                                      <use href="/svg/sprites.svg#it-user"></use>
                                    </svg>
                                    <span className="text-nowrap ms-2">Dati personali</span>
                                  </Link>

                                  <Link className="list-item left-icon text-nowrap" href="/profilo#mie-proposte">
                                    <svg className="icon icon-sm icon-primary left">
                                      <use href="/svg/sprites.svg#it-file"></use>
                                    </svg>
                                    <span className="text-nowrap ms-2">Le mie proposte</span>
                                  </Link>

                                  <Link className="list-item left-icon text-nowrap" href="/profilo#preferiti">
                                    <svg className="icon icon-sm left" style={{ color: "#007a29" }}>
                                      <use href="/svg/custom.svg#heart"></use>
                                    </svg>
                                    <span className="text-nowrap ms-2">Preferiti</span>
                                  </Link>
                                </li>

                                <li><span className="divider"></span></li>

                                <li>
                                  <a
                                    href="#"
                                    className="list-item left-icon text-nowrap list-item-exit"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      logout()
                                      window.location.href = "/"
                                    }}
                                  >
                                    <svg className="icon icon-sm left">
                                      <use href="/svg/sprites.svg#it-link"></use>
                                    </svg>
                                    <span className="text-nowrap ms-2">Esci</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      className="btn btn-primary btn-icon btn-full d-flex align-items-center gap-2"
                      href="/accedi"
                    >
                      <span className="rounded-icon">
                        <svg className="icon icon-primary">
                          <use href="/svg/sprites.svg#it-user"></use>
                        </svg>
                      </span>
                      <span className="d-none d-lg-block">Accedi</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="it-header-center-wrapper">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="it-header-center-content-wrapper">
                <div className="it-brand-wrapper">
                  <Link href="/" className="d-flex align-items-center text-decoration-none">
                    <svg className="icon me-2">
                      <use href="/svg/sprites.svg#it-pa"></use>
                    </svg>
                    <div className="it-brand-text">
                      <div className="it-brand-title">Trento Decide</div>
                    </div>
                  </Link>
                </div>

                <div className="it-right-zone">
                  <form
                    className="it-search-wrapper d-flex align-items-center"
                    onSubmit={handleSearchSubmit}
                  >
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <svg className="icon" aria-hidden="true">
                          <use href="/svg/sprites.svg#it-search"></use>
                        </svg>
                      </span>
                      <input
                        type="search"
                        className="form-control border-start-0"
                        placeholder="Cerca proposte, sondaggi"
                        aria-label="Cerca proposte, sondaggi"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="it-header-navbar-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav
                className="navbar navbar-expand-lg has-megamenu"
                aria-label="Navigazione principale"
              >
                <button
                  className="custom-navbar-toggler"
                  type="button"
                  aria-controls="nav1"
                  aria-expanded="false"
                  aria-label="Mostra/Nascondi la navigazione"
                  data-bs-toggle="navbarcollapsible"
                  data-bs-target="#nav1"
                >
                  <svg className="icon">
                    <use href="/svg/sprites.svg#it-burger"></use>
                  </svg>
                </button>
                <div className="navbar-collapsable" id="nav1">
                  <div className="menu-wrapper">
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${isActive("/popolari") ? "active" : ""}`}
                          href="/popolari"
                        >
                          <span>Popolari</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${isActive("/novita") ? "active" : ""}`}
                          href="/novita"
                        >
                          <span>Novità</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${isActive("/preferiti") ? "active" : ""}`}
                          href="/preferiti"
                        >
                          <span>Preferiti</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${isActive("/proposte/nuova") ? "active" : ""}`}
                          href="/proposte/nuova"
                        >
                          <span>Crea</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${isActive("/regolamento") ? "active" : ""}`}
                          href="/regolamento"
                        >
                          <span>Regolamento</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}