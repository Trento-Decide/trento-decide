"use client"

import { useState, useEffect } from "react"
import { ApiError } from "next/dist/server/api-utils"

import PropostaCard from "@/app/components/PropostaCard"
import { getProposals } from "@/lib/api"
import { getUserData } from "@/lib/local"
import type { User, ProposalSearchItem } from "../../../shared/models"

export default function Profilo() {
  const [userData, setUserData] = useState<User | null>()
  const [myProposals, setMyProposals] = useState<ProposalSearchItem[]>([])
  const [favoriteProposals, setFavoriteProposals] = useState<ProposalSearchItem[]>([])

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const stored = getUserData()
        if (stored) {
          setUserData(stored)
        } else {
          throw Error("Non hai eseguito l'accesso")
        }

        const props = await getProposals({ authorId: stored.id })
        setMyProposals(props.data)

        const favs = await getProposals({ favourites: true })
        setFavoriteProposals(favs.data)
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err.message)
        }
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash === "#mie-proposte" || hash === "#preferiti") {
      const tabEl = document.querySelector(`button[data-bs-target="${hash}"]`) as HTMLElement
      if (tabEl) {
        tabEl.click()
      }
    }
  }, [])

  if (error) return <div className="container my-4">{error}</div>

  if (!userData) return <div className="container my-4"> Failed to fetch user data </div>

  return (
    <div className="container my-4">
      <ul className="nav nav-tabs mb-4" id="profileTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active d-flex align-items-center"
            id="dati-tab"
            data-bs-toggle="tab"
            data-bs-target="#dati"
            type="button"
            role="tab"
            aria-controls="dati"
            aria-selected="true"
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/sprites.svg#it-user"></use>
            </svg>
            Dati personali
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link d-flex align-items-center"
            id="mie-proposte-tab"
            data-bs-toggle="tab"
            data-bs-target="#mie-proposte"
            type="button"
            role="tab"
            aria-controls="mie-proposte"
            aria-selected="false"
            tabIndex={-1}
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/sprites.svg#it-file"></use>
            </svg>
            Le mie proposte
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link d-flex align-items-center"
            id="preferiti-tab"
            data-bs-toggle="tab"
            data-bs-target="#preferiti"
            type="button"
            role="tab"
            aria-controls="preferiti"
            aria-selected="false"
            tabIndex={-1}
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/custom.svg#heart"></use>
            </svg>
            Preferiti
          </button>
        </li>
      </ul>
      <div className="tab-content mt-5" id="profileTabsContent">
        <div
          className="tab-pane fade show active"
          id="dati"
          role="tabpanel"
          aria-labelledby="dati-tab"
        >
            <div className="column">
              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label htmlFor="username" className="active">
                    Username *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={userData.username}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label htmlFor="email" className="active">
                    Indirizzo email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={userData.email}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label className="active d-block">Password *</label>
                  <a
                    href="#"
                    className="text-decoration-none fw-bold"
                    style={{ color: "#006643" }}
                  >
                    Aggiorna password
                  </a>
                </div>
              </div>
            </div>
        </div>
        <div
          className="tab-pane fade"
          id="mie-proposte"
          role="tabpanel"
          aria-labelledby="mie-proposte-tab"
        >
          <div className="row">
            <div className="col-12">
              {myProposals.map(proposal => (
                <PropostaCard key={proposal.id} proposal={proposal} />
              ))}
              {myProposals.length === 0 && <p className="text-muted">Non hai ancora creato nessuna proposta.</p>}
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="preferiti"
          role="tabpanel"
          aria-labelledby="preferiti-tab"
        >
          <div className="row">
            <div className="col-12">
              {favoriteProposals.map(proposal => (
                <PropostaCard key={proposal.id} proposal={proposal} />
              ))}
              {favoriteProposals.length === 0 && <p className="text-muted">Non hai ancora aggiunto nessuna proposta ai preferiti.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
