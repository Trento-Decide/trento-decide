"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { getProposals } from "@/lib/api"
import Breadcrumb from "@/app/components/Breadcrumb"
import ProposalCard from "@/app/components/ProposalCard"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { ProposalSearchItem, ApiError } from "../../../shared/models"

export default function ProposalList() {
  const [proposals, setProposals] = useState<ProposalSearchItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await getProposals({ 
            limit: 10, 
            sortOrder: 'desc', 
            sortBy: 'date' 
        })
        setProposals(res)
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err)
        } else if (err instanceof Error) {
          setError(new ApiError(err.message))
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposals()
  }, [])

  if (error) {
    return (
      <div className="container my-4">
        <Breadcrumb />
        <ErrorDisplay error={error} />
      </div>
    )
  }

  return (
    <div className="container my-4">
      <Breadcrumb />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Proposte</h1>
        <Link href="/proposte/nuova" className="btn btn-primary">
          Nuova Proposta
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Caricamento proposte...
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-5 text-muted">
            <svg className="mb-3" style={{ width: 48, height: 48, opacity: 0.3 }} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
            </svg>
            <p className="mb-0">Nessuna proposta disponibile.</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            {proposals.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}