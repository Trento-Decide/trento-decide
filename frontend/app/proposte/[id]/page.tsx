"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ApiError } from "next/dist/server/api-utils"

import Breadcrumb from "@/app/components/Breadcrumb"
import { getProposal } from "@/lib/api"
import { Proposta } from "../../../../shared/models"

export default function PropostaDettaglio() {
  const { id } = useParams() as { id?: number }
  const [isFavourited, setIsFavourited] = useState(false)
  const [proposal, setProposal] = useState<Proposta | null>(null)

  const [error, setError] = useState<string | null>(null)

  const categoryIcon: Record<string, string> = {
    "Urbanistica": "it-map-marker",
    "Ambiente": "it-flag",
    "Sicurezza": "it-lock",
    "Cultura": "it-bookmark",
    "Istruzione": "it-moodle",
    "Innovazione": "it-software",
    "Mobilità e Trasporti": "it-car",
    "Welfare": "it-user",
    "Sport": "it-flag",
  }

  useEffect(() => {
    if (!id) return

    const fetchProposal = async () => {
      setError(null)
      try {
        const res = await getProposal(id)
        setProposal(res.data)
        setIsFavourited(Boolean(res.data.isFavourited))
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err.message)
        }
      }
    }

    fetchProposal()
  }, [id])

  if (error) return <div className="container my-4">Errore: {error}</div>
  if (!proposal) return <div className="container my-4">Nessuna proposta disponibile.</div>
  return (
    <div className="container my-4">
      <Breadcrumb
        customLabels={{
          [String(proposal.id)]: proposal.title ?? "Proposta"
        }}
      />

      <div className="row">
        <div className="col-md-1 text-center">
          <div className="d-flex flex-column align-items-center">
            <button className="btn btn-link p-0 text-primary" style={{ fontSize: "2rem", lineHeight: 1 }}>
              <svg className="icon icon-primary" aria-hidden="true">
                <use href="/svg/sprites.svg#it-arrow-up-circle"></use>
              </svg>
            </button>
            <span className="fw-bold text-primary" style={{ fontSize: "1.2rem" }}>{proposal.votes}</span>
            <button className="btn btn-link p-0 text-danger" style={{ fontSize: "2rem", lineHeight: 1 }} aria-label="Downvote">
              <svg className="icon icon-danger" aria-hidden="true">
                <use href="/svg/sprites.svg#it-arrow-down-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div className="col-md-10">
          <h1 className="mb-3 fw-bold">{proposal.title}</h1>

          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <span className="badge rounded-pill text-bg-primary px-3 py-2">
                <svg className="icon icon-white icon-sm me-2" aria-hidden="true">
                  <use href={`/svg/sprites.svg#${categoryIcon[proposal.category] ?? "it-info-circle"}`}></use>
                </svg>
                {proposal.category}
              </span>
            </div>
            <div className="text-end text-muted small">
              <div><strong>Autore:</strong> {proposal.author ?? ""}</div>
              <div><strong>Data di creazione:</strong> {proposal.timestamp ? new Date(proposal.timestamp).toLocaleString("it-IT") : ""}</div>
            </div>
          </div>

          <section className="mb-4">
            <h4 className="fw-bold">Descrizione</h4>
            <p>{proposal.description}</p>
          </section>
        </div>

        <div className="col-md-1">
          <div className="d-flex flex-column gap-2 sticky-top align-items-center" style={{ top: "20px" }}>
            <svg
              className="icon"
              role="button"
              onClick={() => setIsFavourited(!isFavourited)}
              aria-label={isFavourited ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              style={{ cursor: "pointer", color: "#ff4d8a" }}
            >
              <use href={isFavourited ? "/svg/custom.svg#heart-filled" : "/svg/custom.svg#heart"}></use>
            </svg>
            <Link href={`/proposte/${proposal.id}/modifica`}>
              <svg
                className="icon icon-warning"
                role="button"
                style={{ cursor: "pointer" }}
              >
                <title>Modifica</title>
                <use href="/svg/sprites.svg#it-pencil"></use>
              </svg>
            </Link>
            <svg
              className="icon icon-secondary"
              role="button"
              style={{ cursor: "pointer" }}
            >
              <title>Cronologia</title>
              <use href="/svg/sprites.svg#it-clock"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
