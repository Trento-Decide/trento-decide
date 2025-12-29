"use client"

import Link from "next/link"
import { useMemo } from "react"
import type { PollSearchItem } from "../../../shared/models"

interface PollCardProps {
  poll: PollSearchItem
}

export default function PollCard({ poll }: PollCardProps) {
  
  const catColor = poll.categoryColour || '#17a2b8';
  const isActive = poll.isActive;

  const timeLeftString = useMemo(() => {
    if (!poll.expiresAt) return null;
    const expiresAt = new Date(poll.expiresAt);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return "Scaduto";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Termina tra ${days}g ${hours}h`;
    return `Termina tra ${hours} ore`;
  }, [poll.expiresAt]);

  return (
    <div 
      className="card h-100 border-0 shadow-sm hover-lift" 
      style={{ borderLeft: `4px solid ${catColor}` }}
    >
      <div className="card-body d-flex flex-column position-relative">
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          
          {isActive ? (
            <div className="d-flex align-items-center text-success fw-bold small">
              <span className="pulse-dot me-2"></span>
              IN CORSO
            </div>
          ) : (
            <span className="badge bg-secondary bg-opacity-25 text-secondary rounded-pill small">
              Concluso
            </span>
          )}

          {isActive && timeLeftString && (
            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">
               <svg className="icon icon-xs me-1" style={{ width:12, height:12, fill:'currentColor', marginBottom:1 }} aria-hidden="true"><use href="/svg/sprites.svg#it-clock"></use></svg>
               {timeLeftString}
            </span>
          )}
        </div>

        <h5 className="card-title fw-bold mb-2">
          <Link href={`/sondaggi/${poll.id}`} className="text-decoration-none text-dark stretched-link">
            {poll.title}
          </Link>
        </h5>

        <p className="card-text text-muted small line-clamp-2 mb-3 flex-grow-1">
          {poll.description}
        </p>

        <div className="d-flex justify-content-between align-items-end mt-auto pt-3 border-top border-light">
          <span 
            className="badge border"
            style={{
              backgroundColor: `color-mix(in srgb, ${catColor}, white 90%)`,
              color: catColor,
              borderColor: catColor
            }}
          >
            {poll.category || 'Generale'}
          </span>

          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            Creato il {poll.date}
          </small>
        </div>

      </div>

      <style jsx>{`
        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #28a745; /* Verde Bootstrap */
          box-shadow: 0 0 0 rgba(40, 167, 69, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(40, 167, 69, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
          }
        }
      `}</style>
    </div>
  )
}