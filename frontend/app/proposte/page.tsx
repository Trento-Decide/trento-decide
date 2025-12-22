"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ApiError } from "next/dist/server/api-utils"

import Breadcrumb from "@/app/components/Breadcrumb"
import PropostaCard from "@/app/components/PropostaCard"
import { getProposals } from "@/lib/api"
import { ProposalSearchItem } from "../../../shared/models"

export default function ProposteList() {
  const [proposals, setProposals] = useState<ProposalSearchItem[]>([])
  
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await getProposals()
        setProposals(res.data)
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err.message)
        }
      }
    }

    fetchProposals()
  }, [])

  if (error) {
    return <div className="container my-4">{error}</div>
  }

  if (proposals.length === 0) {
    return <div className="container my-4">Nessuna proposta disponibile.</div>
  }

  return (
    <div className="container my-4">
      <Breadcrumb />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Proposte</h1>
        <Link href="/proposte/crea" className="btn btn-primary">
          Nuova Proposta
        </Link>
      </div>

      <div className="row">
        <div className="col-12">
          {proposals.map(proposal => (
            <PropostaCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </div>
  )
}
