"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { getUserData, logout } from "@/lib/local"

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null)

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
                  <div className="it-access-top-wrapper">
                    {userName ? (
                      <div className="nav-item dropdown">
                        <style>
                          {`
                            button[aria-expanded="true"] .arrow-icon {
                              transform: rotate(180deg);
                            }
                          `}
                        </style>

                        <Link
                          className="btn btn-outline-primary btn-icon btn-full dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          href="#"
                        >
                          <span className="d-none d-lg-block">
                            Ciao, {userName}
                          </span>

                          <svg
                            className="icon icon-sm icon-white arrow-icon"
                            style={{ transition: "transform 0.3s ease" }}
                          >
                            <use href="/svg/sprites.svg#it-expand"></use>
                          </svg>
                        </Link>

                        <div className="dropdown-menu" aria-labelledby="userDropdown">
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
                                    <Link
                                      className="list-item"
                                      href="/"
                                      onClick={() => { logout() }}
                                    >
                                      <svg className="icon icon-sm icon-primary left">
                                        <use href="/svg/sprites.svg#it-link"></use>
                                      </svg>
                                      <span className="text-nowrap ms-2">Esci</span>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        className="btn btn-primary btn-icon btn-full"
                        href="/accedi"
                      >
                        <span className="rounded-icon">
                          <svg
                            className="icon icon-primary"
                          >
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
      </div>
      <div className="it-header-center-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-header-center-content-wrapper">
                <div className="it-brand-wrapper">
                  <Link href="/">
                    <svg className="icon">
                      <use href="/svg/sprites.svg#it-pa"></use>
                    </svg>
                    <div className="it-brand-text">
                      <div className="it-brand-title">Trento Decide</div>
                    </div>
                  </Link>
                </div>
                <div className="it-right-zone">
                  <div className="it-search-wrapper">
                    <span className="d-none d-md-block">Cerca</span>
                    <a
                      className="search-link rounded-icon"
                      href="#"
                    >
                      <svg
                        className="icon"
                        role="presentation"
                        focusable="false"
                      >
                        <use href="/svg/sprites.svg#it-search"></use>
                      </svg>
                      <span className="visually-hidden">Cerca</span>
                    </a>
                  </div>
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
                        <Link className="nav-link" href="/proposte">
                          <span>Proposte</span>
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
