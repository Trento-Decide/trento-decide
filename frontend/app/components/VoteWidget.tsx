"use client"

import { useEffect, useState, useRef } from "react"
import { getMyVoteForProposal, voteOnProposal, removeVoteFromProposal } from "@/lib/api"
import { theme } from "@/lib/theme"
import { ApiError } from "../../../shared/models"

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

  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadVote = async () => {
      try {
        setLoading(true)
        setError(null)
        const v = await getMyVoteForProposal(proposalId)
        if (v === 1 || v === -1) setVote(v)
        else setVote(null)
      } catch {

      } finally {
        setLoading(false)
      }
    }
    loadVote()
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [proposalId])

  const triggerAnimation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setAnimating(true)
    timeoutRef.current = setTimeout(() => setAnimating(false), 150)
  }

  const handleVoteClick = async (newVote: 1 | -1) => {
    try {
      if (loading || saving) return
      setSaving(true)
      setError(null)

      let newTotal = votes
      triggerAnimation()

      if (vote === newVote) {
        const res = await removeVoteFromProposal(proposalId)
        setVote(null)
        newTotal = res.totalVotes
      } else {
        const res = await voteOnProposal(proposalId, newVote)
        setVote(newVote)
        newTotal = res.totalVotes
      }

      setVotes(newTotal)
      onVotesChange?.(newTotal)

    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode != 401)
          setError(err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  const getContainerStyle = () => {
    if (vote === 1) {
      return {
        backgroundColor: `color-mix(in srgb, ${theme.primary}, white 92%)`,
        borderColor: `color-mix(in srgb, ${theme.primary}, white 60%)`
      }
    }
    if (vote === -1) {
      return {
        backgroundColor: `color-mix(in srgb, #dc3545, white 92%)`,
        borderColor: `color-mix(in srgb, #dc3545, white 60%)`
      }
    }
    return {
      backgroundColor: '#f2f2f7',
      borderColor: 'transparent'
    }
  }

  const containerStyle = getContainerStyle()

  return (
    <div className="w-100">

      <div
        className="d-flex align-items-stretch justify-content-between p-1 rounded-3 border widget-container"
        style={{
          ...containerStyle,
          minHeight: '56px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
      >

        <button
          className={`vote-btn flex-grow-1 d-flex align-items-center justify-content-center rounded-3 border-0 ${vote === 1 ? 'up-active shadow-sm' : 'text-muted'}`}
          onClick={() => handleVoteClick(1)}
          disabled={saving || loading}
          aria-label="Vota favorevole"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.2s' }}>
            <path d="M10.53 5.47a2.25 2.25 0 0 1 2.94 0l6.75 6.136c1.152 1.047.41 2.965-1.144 2.965H4.924c-1.554 0-2.296-1.918-1.144-2.965L10.53 5.47z" />
          </svg>
        </button>

        <div className="d-flex align-items-center justify-content-center px-3" style={{ minWidth: '80px' }}>
          <span
            className={`fw-bold fs-4 vote-number ${vote === 1 ? 'text-primary' : vote === -1 ? 'text-danger' : 'text-dark'} ${animating ? 'pulse' : ''}`}
            style={{
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.5px',
              transition: 'color 0.2s ease-out, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {votes > 0 ? `+${votes}` : votes}
          </span>
        </div>

        <button
          className={`vote-btn flex-grow-1 d-flex align-items-center justify-content-center rounded-3 border-0 ${vote === -1 ? 'down-active shadow-sm' : 'text-muted'}`}
          onClick={() => handleVoteClick(-1)}
          disabled={saving || loading}
          aria-label="Vota contrario"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.2s' }}>
            <path d="M13.47 18.53a2.25 2.25 0 0 1-2.94 0L3.78 12.394c-1.152-1.047-.41-2.965 1.144-2.965h14.152c1.554 0 2.296 1.918 1.144 2.965l-6.75 6.136z" />
          </svg>
        </button>

      </div>

      {error && (
        <div className="text-danger text-center fw-bold mt-1" style={{ fontSize: '0.7rem' }}>
          {error}
        </div>
      )}

      <style jsx>{`
        .vote-btn {
          background-color: transparent;
          color: #8e8e93; 
          transition: background-color 0.2s, color 0.2s, transform 0.1s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .vote-btn:hover:not(:disabled):not(.up-active):not(.down-active) {
          background-color: rgba(0,0,0,0.05);
          color: #1c1c1e;
        }

        .widget-container:not([style*="#f2f2f7"]) .vote-btn:hover:not(:disabled):not(.up-active):not(.down-active) {
           background-color: rgba(255,255,255,0.5);
        }

        .vote-btn:active:not(:disabled) {
          transform: scale(0.94); 
        }

        .up-active {
          background-color: #ffffff !important;
          color: ${theme.primary} !important;
        }

        .down-active {
          background-color: #ffffff !important;
          color: #dc3545 !important;
        }

        .vote-number.pulse {
          transform: scale(1.08); 
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}