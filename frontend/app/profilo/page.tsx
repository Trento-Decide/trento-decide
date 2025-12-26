"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import ProposalCard from "@/app/components/ProposalCard"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { getProposals, deleteProfile } from "@/lib/api"
import { getUserData } from "@/lib/local"
import { ApiError, User, ProposalSearchItem } from "../../../shared/models"

export default function Profile() {
  const router = useRouter()
  const [userData, setUserData] = useState<User | null>()
  const [myProposals, setMyProposals] = useState<ProposalSearchItem[]>([])
  const [favoriteProposals, setFavoriteProposals] = useState<ProposalSearchItem[]>([])

  const [activeTab, setActiveTab] = useState<string>("dati")
  const [isDeleting, setIsDeleting] = useState(false)

  const [error, setError] = useState<ApiError | null>(null)
  const [deleteError, setDeleteError] = useState<ApiError | null>(null)


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
        setMyProposals(props)

        const favs = await getProposals({ favourites: true })
        setFavoriteProposals(favs)
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err)
        } else if (err instanceof Error) {
          setError(new ApiError(err.message))
        }
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      const validTabs = ["dati", "mie-proposte", "preferiti"]
      if (validTabs.includes(hash)) {
        setActiveTab(hash)
      } else {
        setActiveTab("dati")
      }
    }

    handleHashChange()

    window.addEventListener("hashchange", handleHashChange)
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    window.history.replaceState(null, "", `#${tabId}`)
  }

  const handleDeleteProfile = async () => {
    if (!confirm("Sei sicuro di voler eliminare il tuo profilo? Questa azione è irreversibile e cancellerà tutte le tue proposte e i tuoi dati.")) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteError(null)
      await deleteProfile()
      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      console.error("Errore durante l'eliminazione del profilo:", err)
      if (err instanceof ApiError) {
        setDeleteError(err)
      } else {
        setDeleteError(new ApiError("Si è verificato un errore durante l'eliminazione del profilo. Riprova più tardi."))
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (error) return (
    <div className="container my-4">
      <ErrorDisplay error={error} />
    </div>
  )

  if (!userData) return <div className="container my-4"> Failed to fetch user data </div>

  return (
    <div className="container my-4">
      <ul className="nav nav-tabs mb-4" id="profileTabs" role="tablist">
        {/* Dati Personali */}
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "dati" ? "active" : ""}`}
            type="button"
            role="tab"
            onClick={() => handleTabChange("dati")}
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/sprites.svg#it-user"></use>
            </svg>
            Dati personali
          </button>
        </li>

        {/* Le mie proposte */}
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "mie-proposte" ? "active" : ""}`}
            type="button"
            role="tab"
            onClick={() => handleTabChange("mie-proposte")}
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/sprites.svg#it-file"></use>
            </svg>
            Le mie proposte
          </button>
        </li>

        {/* Preferiti */}
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "preferiti" ? "active" : ""}`}
            type="button"
            role="tab"
            onClick={() => handleTabChange("preferiti")}
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/custom.svg#heart"></use>
            </svg>
            Preferiti
          </button>
        </li>
      </ul>

      <div className="tab-content mt-5" id="profileTabsContent">
        {/* Dati personali */}
        <div
          className={`tab-pane fade ${activeTab === "dati" ? "show active" : ""}`}
          role="tabpanel"
        >
            <div className="row">
              <div className="col-12">
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

              <div className="col-12">
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

              <div className="col-12">
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

              <div className="col-12 mt-4">
                <hr />
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDeleteProfile}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Eliminazione in corso..." : "Elimina profilo"}
                  </button>
                </div>
                {deleteError && (
                  <ErrorDisplay error={deleteError} />
                )}
              </div>
            </div>
        </div>

        {/* Mie Proposte */}
        <div
          className={`tab-pane fade ${activeTab === "mie-proposte" ? "show active" : ""}`}
          role="tabpanel"
        >
          <div className="row">
            <div className="col-12">
              {myProposals.map(proposal => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
              {myProposals.length === 0 && <p className="text-muted">Non hai ancora creato nessuna proposta.</p>}
            </div>
          </div>
        </div>

        {/* Preferiti */}
        <div
          className={`tab-pane fade ${activeTab === "preferiti" ? "show active" : ""}`}
          role="tabpanel"
        >
          <div className="row">
            <div className="col-12">
              {favoriteProposals.map(proposal => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
              {favoriteProposals.length === 0 && <p className="text-muted">Non hai ancora aggiunto nessuna proposta ai preferiti.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
