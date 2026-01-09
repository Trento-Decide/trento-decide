"use client"

import Link from "next/link"
import { GlobalSearchItem } from "../../../shared/models"
import { theme } from "@/lib/theme"

interface LabelObj { labels?: { it?: string }; label?: string; code?: string }
interface ColorObj { colour?: string }
interface UserObj { username?: string }

const getSafeLabel = (obj: unknown): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "object") {
     const t = obj as LabelObj;
     return t.labels?.it || t.label || t.code || "";
  }
  return "";
}

const getCategoryColor = (obj: unknown): string => {
    if (typeof obj === 'object' && obj !== null) {
        const t = obj as ColorObj;
        return t.colour || theme.primary;
    }
    return theme.primary; 
}

const getSafeUsername = (obj: unknown): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "object") {
      const t = obj as UserObj;
      return t.username || "";
  }
  return "";
}

const getStatusBadgeStyle = (statusCode?: string) => {
    switch(statusCode?.toLowerCase()) {
        case 'approvata': return { bg: '#d1e7dd', text: '#0f5132', border: '#badbcc' };
        case 'respinta': return { bg: '#f8d7da', text: '#842029', border: '#f5c2c7' };
        case 'in_valutazione': return { bg: '#fff3cd', text: '#664d03', border: '#ffecb5' };
        case 'completata': return { bg: '#cfe2ff', text: '#084298', border: '#b6d4fe' };
        case 'pubblicata': return { bg: '#cff4fc', text: '#055160', border: '#b6effb' };
        case 'bozza': return { bg: '#e2e3e5', text: '#41464b', border: '#d3d6d8' };
        case 'poll_active': return { bg: '#d1e7dd', text: '#0f5132', border: '#badbcc' };
        case 'poll_closed': return { bg: '#e2e3e5', text: '#41464b', border: '#d3d6d8' };
        default: return { bg: '#f8f9fa', text: '#6c757d', border: '#dee2e6' };
    }
}

export default function SearchResultCard({ item }: { item: GlobalSearchItem }) {
  const isPoll = item.type === 'sondaggio';
  
  let statusLabel = "";
  let statusCode = "";

  if (item.type === 'proposta') {
      statusLabel = getSafeLabel(item.status);
      statusCode = typeof item.status === 'object' && item.status 
        ? String((item.status as LabelObj).code || "") 
        : String(item.status || "");
  } else {
      statusLabel = item.isActive ? "Aperto" : "Chiuso";
      statusCode = item.isActive ? "poll_active" : "poll_closed";
  }

  const authorName = getSafeUsername(item.author);
  const categoryName = getSafeLabel(item.category);
  const categoryColor = getCategoryColor(item.category); 
  const linkHref = isPoll ? `/sondaggi/${item.id}` : `/proposte/${item.id}`;
  const statusStyle = getStatusBadgeStyle(statusCode);

  return (
    <div className="card border border-secondary-subtle shadow-sm rounded-3 overflow-hidden h-100 hover-lift bg-white">
      
      <div className="card-body pt-4 px-4 pb-3 d-flex flex-column">
        
        <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center gap-2">
                {categoryName ? (
                    <span 
                        className="badge rounded-3 px-3 py-2 d-flex align-items-center gap-2"
                        style={{
                            backgroundColor: `color-mix(in srgb, ${categoryColor}, white 90%)`,
                            color: `color-mix(in srgb, ${categoryColor}, black 20%)`,
                            border: `1px solid color-mix(in srgb, ${categoryColor}, white 70%)`,
                            fontSize: '0.75rem',
                            fontWeight: 700
                        }}
                    >
                        <span className="rounded-circle" style={{ width: 6, height: 6, backgroundColor: categoryColor }}></span>
                        {categoryName}
                    </span>
                ) : (
                    <span className="badge bg-light text-muted border rounded-3 px-3 py-2">Generale</span>
                )}
            </div>
            <span className="small text-uppercase fw-bold text-muted ls-1" style={{ fontSize: '0.7rem' }}>
                {isPoll ? 'Sondaggio' : 'Proposta'}
            </span>
        </div>
        <div className="mb-3">
            <h5 className="fw-bold mb-2 fs-5">
                <Link href={linkHref} className="text-decoration-none text-dark stretched-link title-hover">
                    {item.title}
                </Link>
            </h5>
            
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
            </p>
        </div>
        <div className="mt-auto pt-3 border-top border-light d-flex align-items-center justify-content-between">
            
            <div className="d-flex align-items-center gap-2">
                {authorName && (
                    <div className="d-flex align-items-center text-muted small">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2 border" style={{width:24, height:24}}>
                            <svg className="icon icon-xs text-secondary"><use href="/svg/sprites.svg#it-user"></use></svg>
                        </div>
                        <span className="fw-medium text-dark">{authorName}</span>
                    </div>
                )}
                
                {item.date && (
                    <>
                        <span className="text-muted opacity-25 mx-1">•</span>
                        <span className="small text-muted">{item.date}</span>
                    </>
                )}
            </div>
            <div>
                {statusLabel && (
                    <span 
                        className="badge rounded-3 fw-bold px-3 py-2 border"
                        style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            borderColor: statusStyle.border,
                            fontSize: '0.75rem'
                        }}
                    >
                        {statusLabel}
                    </span>
                )}
            </div>
        </div>

      </div>

      <style jsx>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08)!important; }
        .title-hover:hover { color: ${theme.primary} !important; text-decoration: underline !important; }
      `}</style>
    </div>
  )
}