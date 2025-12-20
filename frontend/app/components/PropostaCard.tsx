"use client"

import Link from "next/link"

import type { ProposalSearchItem } from "../../../shared/models"

interface PropostaCardProps {
  proposal: ProposalSearchItem
}

export default function PropostaCard({ proposal }: PropostaCardProps) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="row">
          <div className="col-md-1 col-3 text-center d-flex flex-column align-items-center justify-content-center border-end">
            <span className="fw-bold text-primary fs-5">{proposal.voteValue}</span>
            <span className="text-muted small">voti</span>
          </div>
          <div className="col-md-11 col-9 ps-md-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <h5 className="card-title mb-1 me-2">
                <Link href={`/proposte/${proposal.id}`} className="text-decoration-none text-dark fw-bold">
                  {proposal.title}
                </Link>
              </h5>
              <span className={`badge rounded-pill ${proposal.status === "Aperta" ? "text-bg-success" : proposal.status === "In discussione" ? "text-bg-warning" : "text-bg-secondary"} mb-2 mb-md-0`}>
                {proposal.status}
              </span>
            </div>
            <div className="mb-2">
              <span className="badge text-bg-light border me-2 text-dark">{proposal.category}</span>
              <small className="text-muted">
                Proposto da <span className="fw-bold">{proposal.author}</span> il {proposal.date}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
