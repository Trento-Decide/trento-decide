"use client"

import { useEffect, useState } from "react"
import { getMyVoteForProposal, voteOnProposal, removeVoteFromProposal } from "@/lib/api"

type VoteWidgetProps = {
  proposalId: number
  initialVotes: number
  onVotesChange?: (newTotal: number) => void
}

export function VoteWidget({ proposalId, initialVotes, onVotesChange }: VoteWidgetProps) {
  const [vote, setVote] = useState<1 | -1 | null>(null)
  const [votes, setVotes] = useState(initialVotes)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false) 
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVote = async () => {
      try {
        setLoading(true)
        setError(null)
        const v = await getMyVoteForProposal(proposalId)
        if (v === 1 || v === -1) {
          setVote(v)
        } else {
          setVote(null)
        }
      } catch (err) {
        console.error("Errore caricando il voto:", err)
      } finally {
        setLoading(false)
      }
    }

    loadVote()
  }, [proposalId])

  const handleVoteClick = async (newVote: 1 | -1) => {
    try {
      if (loading || saving) return
      setSaving(true)
      setError(null)

      if (vote === newVote) {
        const res = await removeVoteFromProposal(proposalId)
        setVote(null)
        setVotes(res.totalVotes)
        onVotesChange?.(res.totalVotes)
      } else {
        const res = await voteOnProposal(proposalId, newVote)
        setVote(newVote)
        setVotes(res.totalVotes)
        onVotesChange?.(res.totalVotes)
      }
    } catch (err: any) {
      console.error("Errore nel salvataggio del voto:", err)
      setError("Errore nel salvataggio del voto. Riprova.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <button
        className="btn btn-link p-0"
        style={{ fontSize: "2rem", lineHeight: 1 }}
        onClick={() => handleVoteClick(1)}
        disabled={saving || loading}
        aria-label="Vota favorevole"
      >
        <svg
          className={`icon ${vote === 1 ? "icon-primary" : "icon-muted"}`}
          aria-hidden="true"
        >
          <use href="/svg/sprites.svg#it-arrow-up-circle"></use>
        </svg>
      </button>

      <span className="fw-bold text-primary" style={{ fontSize: "1.2rem" }}>
        {votes}
      </span>

      <button
        className="btn btn-link p-0"
        style={{ fontSize: "2rem", lineHeight: 1 }}
        onClick={() => handleVoteClick(-1)}
        disabled={saving || loading}
        aria-label="Vota contrario"
      >
        <svg
          className={`icon ${vote === -1 ? "icon-danger" : "icon-muted"}`}
          aria-hidden="true"
        >
          <use href="/svg/sprites.svg#it-arrow-down-circle"></use>
        </svg>
      </button>

      {error && (
        <div className="text-danger small mt-1 text-center">
          {error}
        </div>
      )}
    </div>
  )
}