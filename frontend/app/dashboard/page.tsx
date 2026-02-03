"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { getUserData } from "@/lib/local"
import { getPolls } from "@/lib/api"
import { theme } from "@/lib/theme"
import Breadcrumb from "@/app/components/Breadcrumb"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import { PollSearchItem, ApiError, User, PollCreateInput } from "../../../shared/models"

export default function AdminDashboard() {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [polls, setPolls] = useState<PollSearchItem[]>([])
    const [error, setError] = useState<ApiError | null>(null)

    // Form state for new poll
    const [newPoll, setNewPoll] = useState<PollCreateInput>({
        title: "",
        description: "",
        isActive: true,
        questions: [{ text: "", options: [{ text: "" }, { text: "" }] }]
    })

    useEffect(() => {
        const user = getUserData()
        setCurrentUser(user)

        // Redirect non-admin users
        if (!user || user.role?.code !== 'admin') {
            router.push('/')
            return
        }

        setIsLoading(false)

        // Fetch active polls
        const fetchPolls = async () => {
            try {
                const data = await getPolls({ isActive: true })
                setPolls(data)
            } catch (err: unknown) {
                if (err instanceof ApiError) setError(err)
                else if (err instanceof Error) setError(new ApiError(err.message))
            }
        }
        fetchPolls()
    }, [router])

    const handleAddQuestion = () => {
        setNewPoll(prev => ({
            ...prev,
            questions: [...(prev.questions || []), { text: "", options: [{ text: "" }, { text: "" }] }]
        }))
    }

    const handleRemoveQuestion = (qIndex: number) => {
        setNewPoll(prev => ({
            ...prev,
            questions: prev.questions?.filter((_, i) => i !== qIndex)
        }))
    }

    const handleQuestionChange = (qIndex: number, text: string) => {
        setNewPoll(prev => ({
            ...prev,
            questions: prev.questions?.map((q, i) => i === qIndex ? { ...q, text } : q)
        }))
    }

    const handleAddOption = (qIndex: number) => {
        setNewPoll(prev => ({
            ...prev,
            questions: prev.questions?.map((q, i) =>
                i === qIndex ? { ...q, options: [...(q.options || []), { text: "" }] } : q
            )
        }))
    }

    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        setNewPoll(prev => ({
            ...prev,
            questions: prev.questions?.map((q, i) =>
                i === qIndex ? { ...q, options: q.options?.filter((_, j) => j !== oIndex) } : q
            )
        }))
    }

    const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
        setNewPoll(prev => ({
            ...prev,
            questions: prev.questions?.map((q, i) =>
                i === qIndex ? {
                    ...q,
                    options: q.options?.map((o, j) => j === oIndex ? { ...o, text } : o)
                } : q
            )
        }))
    }

    if (isLoading) {
        return <div className="container my-5 text-center text-muted">Caricamento...</div>
    }

    if (!currentUser || currentUser.role?.code !== 'admin') {
        return null
    }

    return (
        <div className="page-bg min-vh-100 pb-5 pt-4">
            <div className="container">
                <div className="mb-4">
                    <Breadcrumb />
                </div>

                <div className="d-flex align-items-center gap-3 mb-5">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 48, height: 48, backgroundColor: theme.primary, color: 'white' }}
                    >
                        <svg className="icon icon-sm" style={{ fill: 'white' }}>
                            <use href="/svg/sprites.svg#it-settings"></use>
                        </svg>
                    </div>
                    <div>
                        <h1 className="display-6 fw-bold text-dark mb-0">Dashboard Admin</h1>
                        <p className="text-muted mb-0 small">Gestione sondaggi e contenuti</p>
                    </div>
                </div>

                {error && <ErrorDisplay error={error} className="mb-4" />}

                <div className="row g-4">
                    {/* Left Column - Create Poll Form */}
                    <div className="col-lg-7">
                        <div className="content-card p-4">
                            <h2 className="h5 fw-bold text-dark mb-4">
                                <svg className="icon icon-sm me-2" style={{ fill: theme.primary }}>
                                    <use href="/svg/sprites.svg#it-plus-circle"></use>
                                </svg>
                                Crea Nuovo Sondaggio
                            </h2>

                            <form onSubmit={(e) => e.preventDefault()}>
                                {/* Title */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Titolo *</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Es: Quale area verde preferisci?"
                                        value={newPoll.title}
                                        onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Descrizione</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Spiega brevemente lo scopo del sondaggio..."
                                        value={newPoll.description}
                                        onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                {/* Questions */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-uppercase text-muted d-flex justify-content-between align-items-center">
                                        <span>Domande ({newPoll.questions?.length || 0})</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={handleAddQuestion}
                                        >
                                            + Aggiungi Domanda
                                        </button>
                                    </label>

                                    <div className="d-flex flex-column gap-4 mt-3">
                                        {newPoll.questions?.map((question, qIndex) => (
                                            <div key={qIndex} className="border rounded-3 p-3 bg-light">
                                                <div className="d-flex align-items-start gap-2 mb-3">
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                        style={{ width: 28, height: 28, backgroundColor: theme.primary, color: 'white', fontSize: '0.8rem', fontWeight: 700 }}
                                                    >
                                                        {qIndex + 1}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Testo della domanda..."
                                                        value={question.text}
                                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                                    />
                                                    {(newPoll.questions?.length || 0) > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger flex-shrink-0"
                                                            onClick={() => handleRemoveQuestion(qIndex)}
                                                        >
                                                            <svg className="icon icon-xs" style={{ fill: 'currentColor' }}>
                                                                <use href="/svg/sprites.svg#it-delete"></use>
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Options */}
                                                <div className="ps-4">
                                                    <span className="small text-muted fw-bold">Opzioni:</span>
                                                    <div className="d-flex flex-column gap-2 mt-2">
                                                        {question.options?.map((option, oIndex) => (
                                                            <div key={oIndex} className="d-flex align-items-center gap-2">
                                                                <div className="form-check-input disabled" style={{ marginTop: 0 }}></div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    placeholder={`Opzione ${oIndex + 1}`}
                                                                    value={option.text}
                                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                />
                                                                {(question.options?.length || 0) > 2 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm text-danger p-1"
                                                                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link text-primary p-0 mt-2"
                                                        onClick={() => handleAddOption(qIndex)}
                                                    >
                                                        + Aggiungi Opzione
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Toggle */}
                                <div className="mb-4">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isActive"
                                            checked={newPoll.isActive}
                                            onChange={(e) => setNewPoll(prev => ({ ...prev, isActive: e.target.checked }))}
                                        />
                                        <label className="form-check-label" htmlFor="isActive">
                                            Pubblica immediatamente
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn btn-lg w-100 fw-bold"
                                    style={{ backgroundColor: theme.primary, color: 'white' }}
                                    disabled
                                >
                                    <svg className="icon icon-sm me-2" style={{ fill: 'white' }}>
                                        <use href="/svg/sprites.svg#it-check-circle"></use>
                                    </svg>
                                    Crea Sondaggio (Coming Soon)
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Active Polls */}
                    <div className="col-lg-5">
                        <div className="content-card p-4">
                            <h2 className="h5 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                <span className="pulse-dot-green"></span>
                                Sondaggi Attivi ({polls.length})
                            </h2>

                            {polls.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <svg className="icon mb-3" style={{ width: 48, height: 48, opacity: 0.3 }}>
                                        <use href="/svg/sprites.svg#it-inbox"></use>
                                    </svg>
                                    <p className="mb-0">Nessun sondaggio attivo</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {polls.map(poll => (
                                        <Link
                                            key={poll.id}
                                            href={`/sondaggi/${poll.id}`}
                                            className="text-decoration-none"
                                        >
                                            <div className="poll-item p-3 border rounded-3 bg-white hover-lift">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h6 className="fw-bold text-dark mb-0 lh-sm">{poll.title}</h6>
                                                    <span className="badge bg-success bg-opacity-10 text-success rounded-3 px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                                        ATTIVO
                                                    </span>
                                                </div>
                                                {poll.description && (
                                                    <p className="text-muted small mb-2 line-clamp-2">{poll.description}</p>
                                                )}
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="text-muted x-small">{poll.date}</span>
                                                    {poll.expiresAt && (
                                                        <span className="text-danger x-small fw-bold">
                                                            Scade: {new Date(poll.expiresAt).toLocaleDateString('it-IT')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="content-card p-4 mt-4">
                            <h2 className="h6 fw-bold text-muted text-uppercase mb-3">Statistiche Rapide</h2>
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="text-center p-3 bg-light rounded-3">
                                        <div className="display-6 fw-bold text-dark">{polls.length}</div>
                                        <span className="small text-muted">Sondaggi Attivi</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-3 bg-light rounded-3">
                                        <div className="display-6 fw-bold text-dark">–</div>
                                        <span className="small text-muted">Voti Totali</span>
                                    </div>
                                </div>
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

        .x-small { font-size: 0.75rem; }

        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pulse-dot-green {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #1e7e34;
          box-shadow: 0 0 0 rgba(30, 126, 52, 0.4);
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(30, 126, 52, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(30, 126, 52, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(30, 126, 52, 0);
          }
        }

        .poll-item {
          cursor: pointer;
        }
      `}</style>
        </div>
    )
}
