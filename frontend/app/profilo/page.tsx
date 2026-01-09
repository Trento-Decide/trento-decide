"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import ProposalCard from "@/app/components/ProposalCard"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { getProposals, deleteProfile, addFavouriteProposal, removeFavouriteProposal } from "@/lib/api"
import { getUserData } from "@/lib/local"
import { theme } from "@/lib/theme"
import { ApiError, User, ProposalSearchItem } from "../../../shared/models"

export default function Profile() {
  const router = useRouter()
  const [userData, setUserData] = useState<User | null>(null)
  const [myProposals, setMyProposals] = useState<ProposalSearchItem[]>([])
  const [favouriteProposals, setFavouriteProposals] = useState<ProposalSearchItem[]>([])

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
        setFavouriteProposals(favs)
      } catch (err: unknown) {
        if (err instanceof ApiError) setError(err)
        else if (err instanceof Error) setError(new ApiError(err.message))
      }
    }
    fetchUserProfile()
  }, [])

  const favouriteIds = useMemo(() => new Set(favouriteProposals.map(p => p.id)), [favouriteProposals]);

  const handleToggleFavourite = async (proposalId: number) => {
    const isCurrentlyFavourite = favouriteIds.has(Number(proposalId));
    try {
      if (isCurrentlyFavourite) {
        await removeFavouriteProposal(Number(proposalId))
        setFavouriteProposals(prev => prev.filter(p => p.id !== Number(proposalId)))
      } else {
        await addFavouriteProposal(Number(proposalId))
        const proposalToAdd = myProposals.find(p => p.id === Number(proposalId))
        if (proposalToAdd) {
          setFavouriteProposals(prev => [...prev, proposalToAdd])
        } else {
          const favs = await getProposals({ favourites: true })
          setFavouriteProposals(favs)
        }
      }
    } catch (err) {
      console.error("Errore aggiornamento preferiti:", err)
      alert("Impossibile aggiornare i preferiti al momento.")
    }
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      const validTabs = ["dati", "mie-proposte", "preferiti"]
      if (validTabs.includes(hash)) setActiveTab(hash)
      else setActiveTab("dati")
    }
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    window.history.replaceState(null, "", `#${tabId}`)
  }

  const handleDeleteProfile = async () => {
    if (!confirm("Sei sicuro di voler eliminare il tuo profilo? Questa azione è irreversibile.")) return
    try {
      setIsDeleting(true)
      setDeleteError(null)
      await deleteProfile()
      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      console.error("Errore eliminazione profilo:", err)
      if (err instanceof ApiError) setDeleteError(err)
      else setDeleteError(new ApiError("Errore durante l'eliminazione del profilo."))
    } finally {
      setIsDeleting(false)
    }
  }

  if (error) return <div className="container my-5"><ErrorDisplay error={error} /></div>
  if (!userData) return <div className="container my-5 text-center text-muted">Caricamento profilo...</div>


  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }} className="py-5">
      <div className="container">
        
        <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
          <div className="card-body p-4 d-flex align-items-center gap-4">
            <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold fs-2" 
                 style={{ width: 80, height: 80, backgroundColor: theme.primary }}>
              {userData.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="h3 fw-bold mb-1">{userData.username}</h1>
              <p className="text-muted mb-0">{userData.email}</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-2">
                <nav className="nav flex-column nav-pills gap-1">
                  <button className={`nav-link text-start d-flex align-items-center px-3 py-3 rounded-2 ${activeTab === "dati" ? "active fw-bold shadow-sm" : "text-dark"}`} onClick={() => handleTabChange("dati")} style={activeTab === "dati" ? { backgroundColor: theme.primary } : {}}>
                    <svg className="icon icon-sm me-3" style={{ fill: activeTab === "dati" ? 'white' : '#6c757d' }} aria-hidden="true"><use href="/svg/sprites.svg#it-user"></use></svg> Dati personali
                  </button>
                  <button className={`nav-link text-start d-flex align-items-center px-3 py-3 rounded-2 ${activeTab === "mie-proposte" ? "active fw-bold shadow-sm" : "text-dark"}`} onClick={() => handleTabChange("mie-proposte")} style={activeTab === "mie-proposte" ? { backgroundColor: theme.primary } : {}}>
                    <svg className="icon icon-sm me-3" style={{ fill: activeTab === "mie-proposte" ? 'white' : '#6c757d' }} aria-hidden="true"><use href="/svg/sprites.svg#it-file"></use></svg> Le mie proposte <span className="badge bg-white text-dark ms-auto rounded-3">{myProposals.length}</span>
                  </button>
                  <button className={`nav-link text-start d-flex align-items-center px-3 py-3 rounded-2 ${activeTab === "preferiti" ? "active fw-bold shadow-sm" : "text-dark"}`} onClick={() => handleTabChange("preferiti")} style={activeTab === "preferiti" ? { backgroundColor: theme.primary } : {}}>
                    <svg className="icon icon-sm me-3" style={{ fill: activeTab === "preferiti" ? 'white' : '#6c757d' }} aria-hidden="true"><use href="/svg/custom.svg#heart"></use></svg> Preferiti <span className="badge bg-white text-dark ms-auto rounded-3">{favouriteProposals.length}</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="tab-content">
              <div className={`tab-pane fade ${activeTab === "dati" ? "show active" : ""}`}>
                 <div className="card border-0 shadow-sm rounded-3 mb-4"><div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0"><h5 className="fw-bold mb-0">Informazioni Account</h5></div><div className="card-body p-4"><div className="row g-3"><div className="col-md-6"><div className="p-3 bg-light rounded-3 border"><label className="small text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Nome utente</label><div className="fw-semibold text-dark">{userData.username}</div></div></div><div className="col-md-6"><div className="p-3 bg-light rounded-3 border"><label className="small text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Email</label><div className="fw-semibold text-dark">{userData.email}</div></div></div></div></div></div>
                 <div className="card border-0 shadow-sm rounded-3 mb-4"><div className="card-body p-4 d-flex justify-content-between align-items-center"><div><h6 className="fw-bold mb-1">Password</h6><p className="text-muted small mb-0">Per motivi di sicurezza, la password non è visibile.</p></div><button className="btn btn-outline-primary btn-sm rounded-3 px-3">Modifica Password</button></div></div>
                 <div className="card border-danger border-opacity-25 shadow-sm rounded-3" style={{ backgroundColor: '#fff5f5' }}><div className="card-body p-4"><h6 className="fw-bold text-danger mb-2">Zona Pericolosa</h6><p className="text-muted small mb-3">L&apos;eliminazione del profilo è irreversibile. Tutti i tuoi dati e le tue proposte verranno rimossi permanentemente.</p>{deleteError && <div className="mb-3"><ErrorDisplay error={deleteError} /></div>}<button className="btn btn-danger btn-sm px-3 fw-bold" onClick={handleDeleteProfile} disabled={isDeleting}>{isDeleting ? "Eliminazione in corso..." : "Elimina definitivamente il profilo"}</button></div></div>
              </div>

              <div className={`tab-pane fade ${activeTab === "mie-proposte" ? "show active" : ""}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                   <h5 className="fw-bold mb-0">Le tue proposte</h5>
                   <button className="btn btn-primary btn-sm text-white rounded-3 px-3" onClick={()=> router.push('/proposte/nuova')}>+ Nuova</button>
                </div>
                
                {myProposals.length > 0 ? (
                  <TransitionGroup className="d-flex flex-column gap-3">
                    {myProposals.map(proposal => (

                      <CSSTransition key={proposal.id} timeout={300} classNames="proposal-item">
                        <ProposalCard
                          proposal={proposal}
                          isFavourite={favouriteIds.has(proposal.id)}
                          onToggleFavourite={handleToggleFavourite}
                        />
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                ) : (
                  <EmptyState title="Nessuna proposta" description="Non hai ancora creato nessuna proposta per la città." />
                )}
              </div>

              <div className={`tab-pane fade ${activeTab === "preferiti" ? "show active" : ""}`}>
                <h5 className="fw-bold mb-3">Proposte salvate</h5>
                {favouriteProposals.length > 0 ? (
                  <TransitionGroup className="d-flex flex-column gap-3">
                    {favouriteProposals.map(proposal => (
                      <CSSTransition key={proposal.id} timeout={300} classNames="proposal-item">
                        <ProposalCard
                          proposal={proposal}
                          isFavourite={true}
                          onToggleFavourite={handleToggleFavourite}
                        />
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                ) : (
                  <EmptyState title="Nessun preferito" description="Non hai ancora aggiunto nessuna proposta ai preferiti." />
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .proposal-item-enter {
          opacity: 0;
          transform: scale(0.95);
        }
        .proposal-item-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: opacity 300ms ease-out, transform 300ms ease-out;
        }
        
        .proposal-item-exit {
          opacity: 1;
          transform: scale(1);
        }
        .proposal-item-exit-active {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 300ms ease-in, transform 300ms ease-in;
        }
      `}</style>
    </div>
  )
}

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="text-center py-5 bg-white rounded-3 shadow-sm border border-dashed">
      <div className="text-muted mb-2">
        <svg className="icon icon-lg" style={{width: 48, height: 48, opacity: 0.2}}><use href="/svg/sprites.svg#it-file"></use></svg>
      </div>
      <h6 className="fw-bold text-dark">{title}</h6>
      <p className="text-muted small mb-0">{description}</p>
    </div>
  )
}