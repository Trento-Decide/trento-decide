"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { PollSearchItem } from "../../../shared/models"

interface PollCardProps {
  poll: PollSearchItem
}

export default function PollCard({ poll }: PollCardProps) {
  const getStringLabel = (val: string | { [key: string]: string } | null | undefined): string => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val['it'] || val['en'] || (Object.values(val)[0] as string) || "";
    return "";
  }

  const categoryObj = typeof poll.category === 'object' ? poll.category : undefined;

  const catColor = categoryObj?.colour || '#17a2b8'

  const catLabel = getStringLabel(categoryObj?.labels) || "Generale"

  const isActive = poll.isActive

  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (!poll.expiresAt || !isActive) return

    const targetDate = new Date(poll.expiresAt).getTime()

    const calculateTime = () => {
      const now = new Date().getTime()
      const diff = targetDate - now

      if (diff <= 0) {
        setTimeLeft("Scaduto")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}g ${hours}h ${minutes}m ${seconds}s`)
      } else {
        const h = hours.toString().padStart(2, '0')
        const m = minutes.toString().padStart(2, '0')
        const s = seconds.toString().padStart(2, '0')
        setTimeLeft(`${h}h ${m}m ${s}s`)
      }
    }

    calculateTime()

    const timerId = setInterval(calculateTime, 1000)

    return () => clearInterval(timerId)
  }, [poll.expiresAt, isActive])

  return (
    <div className="card h-100 border-0 rounded-3 shadow-sm hover-lift overflow-hidden position-relative">

      <div style={{ height: '4px', backgroundColor: catColor, width: '100%' }}></div>

      <div className="card-body d-flex flex-column pt-4 px-4 pb-0">

        <div className="d-flex justify-content-between align-items-center mb-3">
          {isActive ? (
            <span className="badge rounded-3 d-flex align-items-center gap-2 px-2 py-1"
              style={{ backgroundColor: '#e6f4ea', color: '#1e7e34', fontWeight: 600, fontSize: '0.75rem' }}>
              <span className="pulse-dot"></span>
              IN CORSO
            </span>
          ) : (
            <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-3 px-2 py-1 fw-semibold" style={{ fontSize: '0.75rem' }}>
              Concluso
            </span>
          )}

          {isActive && timeLeft && (
            <div className="d-flex align-items-center small fw-semibold"
              style={{ color: '#dc3545', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}>
              <svg className="icon icon-xs me-1" style={{ width: 14, height: 14, fill: 'currentColor' }} aria-hidden="true">
                <use href="/svg/sprites.svg#it-clock"></use>
              </svg>
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        <h5 className="card-title fw-bold mb-2 lh-sm">
          <Link href={`/sondaggi/${poll.id}`} className="text-decoration-none text-dark stretched-link link-hover-primary">
            {poll.title}
          </Link>
        </h5>

        <p className="card-text text-muted small line-clamp-2 mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>
          {poll.description}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light">

          <span
            className="badge rounded-3 fw-semibold px-2 py-1"
            style={{
              backgroundColor: `color-mix(in srgb, ${catColor}, white 88%)`,
              color: `color-mix(in srgb, ${catColor}, black 20%)`,
              border: `1px solid color-mix(in srgb, ${catColor}, white 80%)`,
              fontSize: '0.75rem',
              letterSpacing: '-0.2px'
            }}
          >
            {catLabel}
          </span>

          <div className="d-flex align-items-center gap-3">
            {poll.totalVotes !== undefined && (
              <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                <svg className="icon icon-xs" style={{ width: 14, height: 14, fill: 'currentColor' }}>
                  <use href="/svg/sprites.svg#it-user"></use>
                </svg>
                {poll.totalVotes} {poll.totalVotes === 1 ? 'voto' : 'voti'}
              </span>
            )}
            <small className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>
              {poll.date}
            </small>
          </div>
        </div>

      </div>

      <style jsx>{`
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important;
        }

        .link-hover-primary {
          transition: color 0.2s;
        }
        .link-hover-primary:hover {
          color: var(--bs-primary) !important;
        }

        .pulse-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #1e7e34;
          box-shadow: 0 0 0 rgba(30, 126, 52, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(30, 126, 52, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 4px rgba(30, 126, 52, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(30, 126, 52, 0);
          }
        }
      `}</style>
    </div>
  )
}