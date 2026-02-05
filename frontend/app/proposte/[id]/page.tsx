"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

import { getUserData, getAccessToken } from "@/lib/local"

import {
  getProposal,
  addFavouriteProposal,
  removeFavouriteProposal,
  getCategoryFormSchema
} from "@/lib/api"

import Breadcrumb from "@/app/components/Breadcrumb"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { VoteWidget } from "@/app/components/VoteWidget"
import { Proposal, ApiError, FormField, User, MapField } from "../../../../shared/models"
import { theme } from "@/lib/theme"

const LeafletMap = dynamic(() => import("@/app/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="bg-light rounded p-5 text-center text-muted">Caricamento mappa...</div>
})

interface SchemaResponse {
  data: FormField[]
}

export default function ProposalDetail() {
  const { id } = useParams() as { id?: string }
  const router = useRouter()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [schema, setSchema] = useState<FormField[]>([])
  const [isFavourited, setIsFavourited] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const isAuthor = currentUser?.id && proposal?.author && typeof proposal.author === 'object'
    ? Number(currentUser.id) === Number(proposal.author.id)
    : false

  const getStringLabel = (val: unknown): string => {
    if (!val) return ""
    if (typeof val === 'string') return val
    if (typeof val === 'object' && val !== null) {
      const v = val as Record<string, unknown>
      return (v['it'] as string) || (v['en'] as string) || (Object.values(v)[0] as string) || ""
    }
    return ""
  }

  useEffect(() => {
    const user = getUserData()
    // eslint-disable-next-line
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setError(null)
      try {
        const numericId = Number(id)

        const data = await getProposal(numericId)
        setProposal(data)
        setIsFavourited(Boolean(data.isFavourited))

        if (data.category?.id) {
          const formFields = await getCategoryFormSchema(data.category.id)
          const schemaData = Array.isArray(formFields)
            ? formFields
            : (formFields as SchemaResponse).data || []
          setSchema(schemaData)
        }
      } catch (err: unknown) {
        if (err instanceof ApiError) setError(err)
        else if (err instanceof Error) setError(new ApiError(err.message))
      }
    }
    fetchData()
  }, [id])


  const requireAuth = () => {
    const token = getAccessToken()
    if (!token) {
      router.push('/login')
      return false
    }
    return true
  }

  const handleVoteChange = (newTotal: number) => {
    if (!requireAuth()) return
    if (proposal) setProposal({ ...proposal, voteValue: newTotal })
  }

  const handleFavouriteClick = async () => {
    if (!requireAuth()) return

    if (!proposal) return
    try {
      if (isFavourited) {
        const res = await removeFavouriteProposal(proposal.id)
        setIsFavourited(res.isFavourited ?? false)
      } else {
        const res = await addFavouriteProposal(proposal.id)
        setIsFavourited(res.isFavourited ?? true)
      }
    } catch (err) {
      console.error("Errore preferiti:", err)
    }
  }



  const renderDynamicValue = (field: FormField, value: unknown): React.ReactNode => {
    if (value === null || value === undefined || value === "") return <span className="text-muted opacity-50 small">N/D</span>

    switch (field.kind) {
      case "boolean":
        return value ? (
          <span className="d-flex align-items-center gap-2 text-success fw-bold">
            <svg className="icon icon-xs text-success"><use href="/svg/sprites.svg#it-check-circle"></use></svg> Sì
          </span>
        ) : (
          <span className="d-flex align-items-center gap-2 text-muted fw-bold">
            <div className="dot bg-secondary opacity-50"></div> No
          </span>
        )

      case "date":
        return new Date(value as string).toLocaleDateString("it-IT", { day: 'numeric', month: 'short', year: 'numeric' })

      case "number":
        return <span className="fw-bold text-dark">{String(value)} <span className="text-muted fw-normal small ms-1">{field.unit}</span></span>

      case "select":
      case "multiselect":
        const selected = Array.isArray(value) ? value : [value]
        const labels = selected.map((v: string | number) => {
          const opt = field.options?.find(o => o.value === v)
          return getStringLabel(opt?.label) || String(v)
        })
        return labels.join(", ")

      default:
        return typeof value === 'object' ? JSON.stringify(value) : String(value)
    }
  }

  if (error) return <div className="container my-5"><ErrorDisplay error={error} /></div>
  if (!proposal) return <div className="container my-5 text-center text-muted">Caricamento...</div>

  const categoryObj = typeof proposal.category === 'object' ? proposal.category : undefined
  const statusObj = typeof proposal.status === 'object' ? proposal.status : undefined

  const catColor = categoryObj?.colour || theme.primary
  const catLabel = getStringLabel(categoryObj?.labels || categoryObj?.code) || "Generale"

  const statusLabel = getStringLabel(statusObj?.labels) || statusObj?.code || "Attiva"
  const statusColor = statusObj?.colour || theme.primary
  const authorName = typeof proposal.author === 'object' ? proposal.author.username : proposal.author || "Anonimo"

  const mapField = schema.find(f => f.kind === 'map') as MapField | undefined
  const dataFields = schema.filter(f => f.kind !== 'map' && f.kind !== 'file')

  return (
    <div className="page-bg min-vh-100 pb-5 pt-4">

      <div className="container">
        <div className="mb-4">
          <Breadcrumb customLabels={{ [String(proposal.id)]: "Dettaglio" }} />
        </div>

        <div className="row g-5">
          <div className="col-lg-8">
            <div className="mb-5">
              <div className="mb-3 d-inline-block">
                <span
                  className="badge rounded-3 px-3 py-2 shadow-sm"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${catColor}, white 88%)`,
                    color: `color-mix(in srgb, ${catColor}, black 20%)`,
                    border: `1px solid color-mix(in srgb, ${catColor}, white 60%)`,
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {catLabel}
                </span>
              </div>

              <h1 className="display-5 fw-bold text-dark mb-3 lh-sm tracking-tight">{proposal.title}</h1>
              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary">
                <div className="d-flex align-items-center gap-2 bg-white px-3 rounded-3 shadow-xs border metadata-badge">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border" style={{ width: 24, height: 24 }}>
                    <span className="small fw-bold text-dark">{authorName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="small fw-medium text-dark">{authorName}</span>
                </div>

                <div className="d-flex align-items-center gap-2 bg-white px-3 rounded-3 shadow-xs border metadata-badge">
                  <span className="small text-muted">{proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString("it-IT") : ""}</span>
                </div>

                <div className="d-flex align-items-center gap-2 bg-white px-3 rounded-3 shadow-xs border metadata-badge">
                  <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: statusColor }}></div>
                  <span className="small fw-bold text-uppercase" style={{ color: statusColor }}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="content-card p-4 mb-4">
              <h3 className="h6 fw-bold text-muted text-uppercase ls-1 mb-3">Descrizione</h3>
              <div className="text-dark" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                {proposal.description.split('\n').map((line, i) => (
                  line.trim() ? <p key={i} className="mb-3">{line}</p> : <br key={i} />
                ))}
              </div>
            </div>

            {mapField && !!proposal.additionalData?.[mapField.key] && (
              <div className="content-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h6 fw-bold text-muted text-uppercase ls-1 mb-0">
                    {getStringLabel(mapField.label) || "Localizzazione"}
                  </h3>
                </div>

                <div className="overflow-hidden position-relative map-container-readonly border rounded-4">
                  <div style={{ height: '350px', borderRadius: '16px', cursor: 'grab' }}>
                    <LeafletMap
                      value={String(proposal.additionalData[mapField.key] || "")}
                      onChange={() => { }}
                      drawMode={mapField.drawMode || 'marker'}
                    />
                  </div>
                </div>
              </div>
            )}


            {dataFields.some(f => proposal.additionalData?.[f.key]) && (
              <div className="mb-5">
                <h3 className="h6 fw-bold text-muted text-uppercase ls-1 mb-3 ms-1">Dettagli Tecnici</h3>
                <div className="row g-3">
                  {dataFields.map((field) => {
                    const value = proposal.additionalData?.[field.key]
                    if (value === undefined || value === "") return null
                    return (
                      <div className="col-sm-6" key={field.key}>
                        <div className="content-card p-3 h-100 d-flex flex-column justify-content-center">
                          <span className="d-block text-muted x-small fw-bold text-uppercase mb-1">
                            {getStringLabel(field.label)}
                          </span>
                          <div className="text-dark fs-6">
                            {renderDynamicValue(field, value)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4 sticky-top" style={{ top: '24px', zIndex: 10 }}>

              <div className="content-card p-4 text-center mt-lg-5 pt-lg-5 border-0 shadow-none bg-transparent d-none d-lg-block">
              </div>

              <div className="content-card p-4 text-center">
                <span className="text-uppercase fw-bold text-muted x-small ls-1">Valutazione Community</span>
                <div className="my-3">
                  <VoteWidget
                    proposalId={proposal.id}
                    initialVotes={proposal.voteValue}
                    onVotesChange={handleVoteChange}
                  />
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                {isAuthor ? (
                  <Link
                    href={`/proposte/${proposal.id}/modifica`}
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold rounded-3 shadow-sm hover-scale"
                    style={{ backgroundColor: '#e3b448', color: theme.text.dark, border: 'none' }}
                  >
                    <svg className="icon icon-sm"><use href="/svg/sprites.svg#it-pencil"></use></svg>
                    Modifica Proposta
                  </Link>
                ) : (
                  <button
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold rounded-3 shadow-sm hover-scale bg-white text-dark border"
                  >
                    <svg className="icon icon-sm text-dark"><use href="/svg/sprites.svg#it-pencil"></use></svg>
                    Proponi Modifica
                  </button>
                )}

                <button
                  onClick={handleFavouriteClick}
                  className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold rounded-3 shadow-sm hover-scale transition-all"
                  style={{
                    backgroundColor: isFavourited ? '#dc3545' : 'white',
                    color: isFavourited ? 'white' : '#dc3545',
                    border: '1px solid #dc3545'
                  }}
                >
                  <svg className="icon icon-sm" style={{ width: 24, height: 24 }}>
                    <use href={`/svg/custom.svg#${isFavourited ? 'heart-filled' : 'heart'}`}></use>
                  </svg>
                  {isFavourited ? "Rimuovi dai Preferiti" : "Aggiungi ai Preferiti"}
                </button>

                <button
                  className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 fw-bold shadow-sm hover-scale mt-1"
                  style={{ backgroundColor: '#d1cbc2', color: theme.text.dark, border: 'none' }}
                >
                  <svg className="icon icon-sm text-dark"><use href="/svg/sprites.svg#it-clock"></use></svg>
                  Cronologia
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .page-bg { background-color: #F5F5F7; }
        
        .content-card {
           background-color: white;
           border-radius: 20px;
           box-shadow: 0 4px 12px rgba(0,0,0,0.03);
           border: 1px solid rgba(0,0,0,0.03);
        }
        
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .metadata-badge { height: 36px; }
        .min-w-0 { min-width: 0; } 

        .ls-1 { letter-spacing: 0.5px; }
        .x-small { font-size: 0.75rem; }
        .tracking-tight { letter-spacing: -0.02em; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        
        .hover-scale { transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .hover-scale:active { transform: scale(0.97); }

        .map-container-readonly .leaflet-draw-section { display: none !important; }
        .map-container-readonly .leaflet-control-zoom { display: block !important; }
      `}</style>
    </div>
  )
}