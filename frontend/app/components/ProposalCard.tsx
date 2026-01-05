"use client"

import { useState } from "react"
import Link from "next/link"
import type { ProposalSearchItem } from "../../../shared/models"
import { theme } from "@/lib/theme"

interface PropostaCardProps {
  proposal: ProposalSearchItem
  isFavourite?: boolean
  onToggleFavourite?: (id: number) => void
}

export default function ProposalCard({ 
  proposal, 
  isFavourite: isFavourite = false, 
  onToggleFavourite: onToggleFavourite 
}: PropostaCardProps) {
  
  const [isAnimating, setIsAnimating] = useState(false)
  const getStringLabel = (val: string | { [key: string]: string } | null | undefined): string => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val['it'] || val['en'] || (Object.values(val)[0] as string) || "";
    return "";
  }

  const statusObj = typeof proposal.status === 'object' && proposal.status !== null 
    ? proposal.status 
    : { code: 'sconosciuto', labels: { it: 'Sconosciuto' }, colour: '#6c757d' }

  const categoryObj = typeof proposal.category === 'object' && proposal.category !== null
    ? proposal.category
    : undefined

  const statusLabel = getStringLabel(statusObj.labels) || statusObj.code || "Sconosciuto"
  
  const rawCatLabel = categoryObj?.labels;
  const categoryLabel = getStringLabel(rawCatLabel) || "Generale";
  
  const isDraft = statusObj.code === 'bozza'
  const catColor = categoryObj?.colour || '#6c757d'
  const statusColor = statusObj.colour || '#6c757d'
  
  const voteCount = proposal.voteValue ?? 0
  
  const authorName = typeof proposal.author === 'object' 
    ? proposal.author.username 
    : (proposal.author || "Anonimo")
  
  const dateStr = proposal.createdAt 
    ? new Date(proposal.createdAt).toLocaleDateString('it-IT') 
    : ""

  const cardStyle = isDraft 
    ? { 
        backgroundColor: '#fffbe6', 
        borderColor: '#ffe58f',
        borderStyle: 'solid'
      } 
    : { 
        backgroundColor: '#fff', 
        borderColor: 'transparent' 
      }

  const targetLink = isDraft 
    ? `/proposte/${proposal.id}/modifica` 
    : `/proposte/${proposal.id}`

  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isFavourite) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }

    if (onToggleFavourite) {
      onToggleFavourite(proposal.id);
    }
  };

  return (
    <div 
      className={`card mb-3 rounded-3 overflow-hidden position-relative proposal-card-wrapper transition-all ${isDraft ? '' : 'shadow-sm hover-lift border-0'}`}
      style={cardStyle}
    >

      <div style={{ height: '4px', backgroundColor: catColor, width: '100%', opacity: isDraft ? 0.6 : 1 }}></div>

      <div className="card-body pt-3 px-4 pb-0">
        <div className="d-flex gap-3 align-items-center">

          <Link href={targetLink} className="text-decoration-none">
            <div className={`d-flex flex-column align-items-center justify-content-center p-2 rounded-3 text-center transition-colors ${isDraft ? 'draft-box' : ''}`} 
                style={{ 
                  backgroundColor: isDraft ? 'rgba(233, 180, 72, 0.15)' : '#f8f9fa', 
                  minWidth: '65px', 
                  height: '65px', 
                  border: isDraft ? '1px solid rgba(233, 180, 72, 0.3)' : '1px solid #e9ecef',
                  color: isDraft ? '#b08d28' : theme.primary
                }}>
              
              {isDraft ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              ) : (
                <>
                  <span className="fw-bold fs-5 lh-1">{voteCount}</span>
                  <span className="text-muted fw-medium mt-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Voti</span>
                </>
              )}
            </div>
          </Link>

          <div className="flex-grow-1 min-w-0">
            
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="card-title mb-0 me-2 text-truncate fw-bold fs-6">
                <Link href={targetLink} className="text-decoration-none text-dark stretched-link link-hover-primary">
                  {proposal.title || "Nuova Bozza (Senza titolo)"}
                </Link>
              </h6>
              <span 
                className="badge rounded-3 fw-semibold px-2 py-1 flex-shrink-0" 
                style={{ 
                    backgroundColor: isDraft ? '#fff3cd' : `color-mix(in srgb, ${statusColor}, white 88%)`,
                    color: isDraft ? '#856404' : `color-mix(in srgb, ${statusColor}, black 20%)`,
                    border: isDraft ? '1px solid #ffeeba' : `1px solid color-mix(in srgb, ${statusColor}, white 70%)`,
                    fontSize: '0.65rem' 
                }}
              >
                {statusLabel.toUpperCase()}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
              
              {(!isDraft && (isFavourite || onToggleFavourite)) && (
                <button 
                  onClick={handleFavouriteClick}
                  className={`btn btn-link p-0 d-flex align-items-center justify-content-center border-0 fav-btn ${isFavourite ? 'is-active' : ''} ${isAnimating ? 'animate-pop' : ''}`}
                  style={{ zIndex: 5, position: 'relative' }}
                  title={isFavourite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                >
                  {isFavourite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="heart-icon filled">
                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="heart-icon outline">
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                    </svg>
                  )}
                </button>
              )}

              <span 
                className="badge rounded-3 fw-semibold px-2"
                style={{
                  backgroundColor: `color-mix(in srgb, ${catColor}, white 88%)`,
                  color: `color-mix(in srgb, ${catColor}, black 20%)`,
                  border: `1px solid color-mix(in srgb, ${catColor}, white 80%)`,
                  fontSize: '0.7rem',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {categoryLabel}
              </span>

              <small className="text-muted d-flex align-items-center text-truncate" style={{ fontSize: '0.75rem' }}>
                <span>di <strong>{authorName}</strong></span>
                <span className="mx-1">•</span>
                <span>{dateStr}</span>
              </small>

            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        .transition-all { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .transition-colors { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important;
        }

        .link-hover-primary { transition: color 0.2s; }
        .link-hover-primary:hover { color: ${theme.primary} !important; }

        .draft-box:hover {
           background-color: rgba(233, 180, 72, 0.25) !important;
        }
        
        .fav-btn {
          color: #adb5bd;
          transition: color 0.2s ease, transform 0.1s ease;
        }
        .fav-btn:active { transform: scale(0.8); }
        .fav-btn.is-active { color: #dc3545; }
        .fav-btn.animate-pop .heart-icon.filled {
          animation: heartPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes heartPop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}