"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ApiError } from "next/dist/server/api-utils"

import { createDraft, saveDraft, publishProposal, getProposal, updateProposal, deleteProposal } from "@/lib/api"
import { getUserData } from "@/lib/local"
import Breadcrumb from "@/app/components/Breadcrumb"
import ProposalForm from "@/app/components/ProposalForm"
import type { ProposalInput } from "../../../../shared/models"

export default function ProposalEditor() {
  const [proposal, setProposal] = useState<ProposalInput>({
    title: "",
    description: "",
  })
  const [error, setError] = useState<string | null>(null)

  const [proposalId, setProposalId] = useState<number | null>(null)
  const [statusCode, setStatusCode] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState<boolean | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const user = getUserData()

  // load proposal when editing via ?proposalId=
  useEffect(() => {
    const q = searchParams.get("proposalId")
    if (!q) return
    const id = Number(q)
    if (!Number.isInteger(id)) return
    if (proposalId && proposalId === id) return

    const fetchForEdit = async () => {
      setError(null)
      try {
        const p = await getProposal(id)
        const owner = Boolean(user && user.id === p.author.id)

        // populate form data regardless, but mark ownership
        setProposal({
          title: p.title,
          description: p.description,
          categoryId: p.category.id,
          additionalData: p.additionalData ?? {},
        })
        setProposalId(p.id)
        setStatusCode(p.status?.code ?? null)
        setIsOwner(owner)

        if (!owner) return
      } catch (err) {
        if (err instanceof ApiError) setError(err.message)
        else if (err instanceof Error) setError(err.message)
        else setError("Errore caricamento proposta")
      }
    }

    fetchForEdit()
  }, [searchParams, proposalId, user])

  const saveOrCreateDraft = async (): Promise<number> => {
    if (proposalId) {
      await saveDraft(proposalId, proposal)
      return proposalId
    } else {
      if (!proposal.categoryId) {
        throw new Error("Category is required to create a new draft.")
      }
      const res = await createDraft(proposal)
      setProposalId(res.id)
      return res.id
    }
  }

  const handleSave = async () => {
    setError(null)

    try {
      await saveOrCreateDraft()
      router.push(`/profilo#mie-proposte`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError("Errore sconosciuto")
    }
  }

  const handlePublish = async () => {
    setError(null)

    try {
      const id = await saveOrCreateDraft()
      await publishProposal(id)
      router.push(`/profilo#mie-proposte`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError("Errore sconosciuto")
    }
  }

  const handlePublishChanges = async () => {
    if (!proposalId) return
    setError(null)

    try {
      await updateProposal(proposalId, proposal)
      router.push(`/profilo#mie-proposte`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError("Errore sconosciuto")
    }
  }

  const handleDelete = async () => {
    if (!proposalId) {
      router.push("/proposte")
      return
    }

    if (!confirm("Sei sicuro di voler eliminare questa proposta?")) return

    setError(null)
    try {
      await deleteProposal(proposalId)
      router.push(`/profilo#mie-proposte`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError("Errore nello eliminare la proposta")
    }
  }

  const editing = Boolean(proposalId)
  const editingOther = editing && isOwner === false

  return (
    <div className="container my-4">
      <Breadcrumb customLabels={{ editor: editing ? "Modifica" : "Crea" }} />

      <h1 className="mb-4 fw-bold">{editing ? (editingOther ? "Proponi modifiche" : "Modifica proposta") : "Crea una nuova proposta"}</h1>

      <div className="card shadow-sm p-4 border-0 mt-4">
        <ProposalForm proposal={proposal} onProposalChange={setProposal} />
      </div>

      {editingOther ? (
        <div className="d-flex justify-content-between mt-5">
          <div className="d-flex gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => router.push("/proposte")}>
              Annulla
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              /* noop for now */
            }}
          >
            Proponi modifiche
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-between mt-5">
          {statusCode === "bozza" || statusCode === null ? (
            <>
              <div className="d-flex gap-3">
                <button type="button" className="btn btn-success text-white" onClick={handleSave}>
                  Salva bozza
                </button>
                {proposalId ? (
                  <button type="button" className="btn btn-secondary" onClick={handleDelete}>
                    Elimina bozza
                  </button>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={() => router.push("/proposte")}>
                    Annulla
                  </button>
                )}
              </div>
              <button type="button" className="btn btn-primary" onClick={handlePublish}>
                Pubblica proposta
              </button>
            </>
          ) : (
            <>
              <div className="d-flex gap-3">
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Elimina
                </button>
              </div>
              <div>
                <button type="button" className="btn btn-primary" onClick={handlePublishChanges}>
                  Pubblica modifiche
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {error && <div className="alert alert-danger mt-4">{error}</div>}
    </div>
  )
}
