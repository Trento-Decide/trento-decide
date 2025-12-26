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

  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await getProposals()
        setProposals(res)
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err)
        } else if (err instanceof Error) {
          setError(new ApiError(err.message))
        }
      }
    }

    fetchProposals()
  }, [])

  if (error) {
    return (
      <div className="container my-4">
        <ErrorDisplay error={error} />
      </div>
    )
  }

  if (proposals.length === 0) {
    return <div className="container my-4">Nessuna proposta disponibile.</div>
  }

  return (
    <div className="container my-4">
      <Breadcrumb />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Proposte</h1>
        <Link href="/proposte/editor" className="btn btn-primary">
          Nuova Proposta
        </Link>
      </div>

      <div className="row">
        <div className="col-12">
          {proposals.map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </div>
  )
}
