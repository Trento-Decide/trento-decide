"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import { getPoll } from "@/lib/api"

import Breadcrumb from "@/app/components/Breadcrumb"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { Poll, ApiError } from "../../../../shared/models"
import { theme } from "@/lib/theme"

export default function PollDetail() {
    const { id } = useParams() as { id?: string }

    const [poll, setPoll] = useState<Poll | null>(null)
    const [userHasVoted, setUserHasVoted] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number | null>>({})
    const [error, setError] = useState<ApiError | null>(null)

    const [isCopied, setIsCopied] = useState(false)
    const [timeLeft, setTimeLeft] = useState<string | null>(null)

    const getStringLabel = (val: unknown): string => {
        if (!val) return ""
        if (typeof val === 'string') return val
        if (typeof val === 'object' && val !== null) {
            const v = val as Record<string, unknown>
            return (v['it'] as string) || (v['en'] as string) || (Object.values(v)[0] as string) || ""
        }
        return ""
    }

    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            setError(null)
            try {
                const numericId = Number(id)
                const data = await getPoll(numericId)
                setPoll(data.data)
                setUserHasVoted(data.userHasVoted)
            } catch (err: unknown) {
                if (err instanceof ApiError) setError(err)
                else if (err instanceof Error) setError(new ApiError(err.message))
            }
        }
        fetchData()
    }, [id])

    // Countdown timer
    useEffect(() => {
        if (!poll?.expiresAt || !poll.isActive) return

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
    }, [poll?.expiresAt, poll?.isActive])

    const handleOptionSelect = (questionId: number, optionId: number) => {
        if (userHasVoted) return
        setSelectedOptions(prev => ({
            ...prev,
            [questionId]: prev[questionId] === optionId ? null : optionId
        }))
    }

    const handleShare = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        })
    }

    if (error) return <div className="container my-5"><ErrorDisplay error={error} /></div>
    if (!poll) return <div className="container my-5 text-center text-muted">Caricamento...</div>

    const categoryObj = typeof poll.category === 'object' ? poll.category : undefined
    const catColor = categoryObj?.colour || theme.primary
    const catLabel = getStringLabel(categoryObj?.labels || categoryObj?.code) || "Generale"
    const authorName = typeof poll.createdBy === 'object' ? poll.createdBy.username : "Anonimo"

    return (
        <div className="page-bg min-vh-100 pb-5 pt-4">
            <div className="container">
                <div className="mb-4">
                    <Breadcrumb customLabels={{ [String(poll.id)]: "Dettaglio" }} />
                </div>

                <div className="row g-5">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="mb-5">
                            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                <span
                                    className="badge rounded-3 px-3 py-2 shadow-sm"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${catColor}, white 88%)`,
                                        color: `color-mix(in srgb, ${catColor}, black 20%)`,
                                        border: `1px solid color-mix(in srgb, ${catColor}, white 60%)`,
                                        fontSize: '0.85rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {catLabel}
                                </span>

                                {poll.isActive ? (
                                    <span className="badge rounded-3 d-flex align-items-center gap-2 px-3 py-2"
                                        style={{ backgroundColor: '#e6f4ea', color: '#1e7e34', fontWeight: 600, fontSize: '0.85rem' }}>
                                        <span className="pulse-dot"></span>
                                        ATTIVO
                                    </span>
                                ) : (
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-3 px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                        Concluso
                                    </span>
                                )}
                            </div>

                            <h1 className="display-5 fw-bold text-dark mb-3 lh-sm tracking-tight">{poll.title}</h1>

                            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary">
                                <div className="d-flex align-items-center gap-2 bg-white px-3 rounded-3 shadow-xs border metadata-badge">
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border" style={{ width: 24, height: 24 }}>
                                        <span className="small fw-bold text-dark">{authorName.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="small fw-medium text-dark">{authorName}</span>
                                </div>

                                <div className="d-flex align-items-center gap-2 bg-white px-3 rounded-3 shadow-xs border metadata-badge">
                                    <span className="small text-muted">{poll.createdAt ? new Date(poll.createdAt).toLocaleDateString("it-IT") : ""}</span>
                                </div>

                                {poll.isActive && timeLeft && (
                                    <div className="d-flex align-items-center gap-2 bg-white px-3 rounded-3 shadow-xs border metadata-badge"
                                        style={{ color: '#dc3545' }}>
                                        <svg className="icon icon-xs" style={{ width: 14, height: 14, fill: 'currentColor' }}>
                                            <use href="/svg/sprites.svg#it-clock"></use>
                                        </svg>
                                        <span className="small fw-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>-{timeLeft}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {poll.description && (
                            <div className="content-card p-4 mb-4">
                                <h3 className="h6 fw-bold text-muted text-uppercase ls-1 mb-3">Descrizione</h3>
                                <div className="text-dark" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                                    {poll.description.split('\n').map((line, i) => (
                                        line.trim() ? <p key={i} className="mb-3">{line}</p> : <br key={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Questions */}
                        <div className="mb-4">
                            <h3 className="h6 fw-bold text-muted text-uppercase ls-1 mb-3 ms-1">
                                Domande ({poll.questions?.length || 0})
                            </h3>

                            <div className="d-flex flex-column gap-4">
                                {poll.questions?.map((question, qIndex) => (
                                    <div key={question.id} className="content-card p-4">
                                        <div className="d-flex align-items-start gap-3 mb-4">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    backgroundColor: catColor,
                                                    color: 'white',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {qIndex + 1}
                                            </div>
                                            <h4 className="fw-bold text-dark mb-0 lh-base" style={{ fontSize: '1.1rem' }}>
                                                {question.text}
                                            </h4>
                                        </div>

                                        <div className="d-flex flex-column gap-2">
                                            {question.options?.map((option) => {
                                                const isSelected = selectedOptions[question.id] === option.id
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleOptionSelect(question.id, option.id)}
                                                        disabled={userHasVoted}
                                                        className={`option-btn d-flex align-items-center gap-3 p-3 rounded-3 border text-start w-100 ${isSelected ? 'selected' : ''} ${userHasVoted ? 'voted' : ''}`}
                                                        style={{
                                                            backgroundColor: isSelected ? `color-mix(in srgb, ${catColor}, white 90%)` : 'white',
                                                            borderColor: isSelected ? catColor : '#e0e0e0',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <div
                                                            className="option-radio flex-shrink-0 d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                border: isSelected ? `2px solid ${catColor}` : '2px solid #ccc',
                                                                backgroundColor: isSelected ? catColor : 'transparent',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            {isSelected && (
                                                                <svg className="icon icon-xs" style={{ width: 12, height: 12, fill: 'white' }}>
                                                                    <use href="/svg/sprites.svg#it-check"></use>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className={`fw-medium ${isSelected ? 'text-dark' : 'text-secondary'}`}>
                                                            {option.text}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {userHasVoted && (
                                            <div className="mt-3 pt-3 border-top">
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-3 px-2 py-1">
                                                    <svg className="icon icon-xs me-1" style={{ width: 12, height: 12, fill: 'currentColor' }}>
                                                        <use href="/svg/sprites.svg#it-check"></use>
                                                    </svg>
                                                    Hai già votato questa domanda
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-4 sticky-top" style={{ top: '24px', zIndex: 10 }}>

                            <div className="content-card p-4 text-center mt-lg-5 pt-lg-5 border-0 shadow-none bg-transparent d-none d-lg-block">
                            </div>

                            {/* Poll Info */}
                            <div className="content-card p-4">
                                <h5 className="fw-bold text-dark mb-4">Informazioni Sondaggio</h5>

                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Stato</span>
                                        <span className={`fw-bold small ${poll.isActive ? 'text-success' : 'text-secondary'}`}>
                                            {poll.isActive ? 'Attivo' : 'Concluso'}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Domande</span>
                                        <span className="fw-bold small text-dark">{poll.questions?.length || 0}</span>
                                    </div>

                                    {poll.expiresAt && (
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted small">Scadenza</span>
                                            <span className="fw-bold small text-dark">
                                                {new Date(poll.expiresAt).toLocaleDateString("it-IT", {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="d-flex flex-column gap-2">
                                <button
                                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold rounded-3 shadow-sm hover-scale"
                                    style={{
                                        backgroundColor: poll.isActive && !userHasVoted ? catColor : '#e0e0e0',
                                        color: poll.isActive && !userHasVoted ? 'white' : '#888',
                                        border: 'none',
                                        cursor: poll.isActive && !userHasVoted ? 'pointer' : 'not-allowed'
                                    }}
                                    disabled={!poll.isActive || userHasVoted}
                                >
                                    <svg className="icon icon-sm" style={{ fill: 'currentColor' }}>
                                        <use href="/svg/sprites.svg#it-check-circle"></use>
                                    </svg>
                                    {userHasVoted ? 'Hai già votato' : 'Invia Voti'}
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 fw-bold text-white shadow-sm hover-scale transition-all"
                                    style={{
                                        backgroundColor: isCopied ? '#198754' : '#2083cc',
                                        border: 'none'
                                    }}
                                >
                                    {isCopied ? (
                                        <>
                                            <svg className="icon icon-sm text-white" style={{ fill: 'white' }}><use href="/svg/sprites.svg#it-check"></use></svg>
                                            Copiato!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="icon icon-sm text-white" style={{ fill: 'white' }}><use href="/svg/sprites.svg#it-share"></use></svg>
                                            Condividi
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .page-bg { background-color: #F5F5F7; }
        
        .content-card {
           background-color: white;
           border-radius: 20px;
           box-shadow: 0 4px 12px rgba(0,0,0,0.03);
           border: 1px solid rgba(0,0,0,0.03);
        }
        
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .metadata-badge { height: 36px; }

        .ls-1 { letter-spacing: 0.5px; }
        .x-small { font-size: 0.75rem; }
        .tracking-tight { letter-spacing: -0.02em; }
        
        .hover-scale { transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .hover-scale:active { transform: scale(0.97); }

        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
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

        .option-btn {
          cursor: pointer;
          background: white;
        }
        .option-btn:hover:not(.voted):not(.selected) {
          background-color: #f8f9fa;
          border-color: #ccc;
        }
        .option-btn.voted {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .option-btn.selected {
          box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
        }
      `}</style>
        </div>
    )
}
