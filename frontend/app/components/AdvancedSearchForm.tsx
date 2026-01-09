"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { theme } from "@/lib/theme"
import type { Category, Status } from "../../../shared/models"

interface AdvancedSearchFormProps {
  categories: Category[]
  statuses: Status[]
}

export default function AdvancedSearchForm({ categories, statuses }: AdvancedSearchFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    q: "",
    titlesOnly: false,
    author: "",
    categoryCode: "",
    statusCode: "", 
    minVotes: "",
    maxVotes: "",
    isActive: "",
    dateFrom: "",
    dateTo: "",
    type: "all",
    sortBy: "date",
    sortOrder: "desc"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => {
      const nextState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }

      if (name === 'type') {
        if (value === 'sondaggio') {
          nextState.minVotes = ""
          nextState.maxVotes = ""
          nextState.statusCode = ""
        } else if (value === 'proposta') {
          nextState.isActive = ""
        }
      }
      return nextState
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (formData.q) params.set("q", formData.q)
    if (formData.titlesOnly) params.set("titlesOnly", "true")
    if (formData.author) params.set("author", formData.author)
    if (formData.categoryCode) params.set("category", formData.categoryCode)
    if (formData.dateFrom) params.set("dateFrom", formData.dateFrom)
    if (formData.dateTo) params.set("dateTo", formData.dateTo)
    
    if (formData.type && formData.type !== "all") {
        params.set("type", formData.type)
    }
    
    if (formData.type !== 'sondaggio') {
      if (formData.statusCode) params.set("status", formData.statusCode)
      if (formData.minVotes) params.set("minVotes", formData.minVotes)
      if (formData.maxVotes) params.set("maxVotes", formData.maxVotes)
    }

    if (formData.type !== 'proposta') {
       if (formData.isActive) params.set("status", formData.isActive === 'true' ? 'poll_active' : 'poll_closed')
    }
    
    if (formData.sortBy !== "date" || formData.sortOrder !== "desc") {
      params.set("sortBy", formData.sortBy)
      params.set("sortOrder", formData.sortOrder)
    }

    router.push(`/cerca?${params.toString()}`)
  }

  const isPoll = formData.type === 'sondaggio';
  const isProposal = formData.type === 'proposta';

  const inputClass = "form-control bg-off-white custom-border py-2";
  const selectClass = "form-select bg-off-white custom-border py-2";
  const groupTextClass = "input-group-text bg-off-white custom-border border-end-0 text-muted";
  const labelClass = "form-label small fw-bold text-uppercase text-muted ls-1 mb-1";

  return (
    <div className="container py-5">
      
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          
          <div className="card border border-secondary-subtle shadow-sm rounded-3 bg-white">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-5">
                 <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3" 
                      style={{ backgroundColor: `${theme.primary}15` }}>
                    <svg className="icon icon-lg" style={{ fill: theme.primary, width: 32, height: 32 }}>
                        <use href="/svg/sprites.svg#it-search"></use>
                    </svg>
                 </div>
                 <h1 className="h3 fw-bold mb-2 text-dark">Ricerca Avanzata</h1>
                 <p className="text-muted">Compila i campi sottostanti per filtrare i contenuti con precisione.</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className={labelClass}>Cosa cerchi?</label>
                  <div className="input-group">
                    <span className={groupTextClass}>
                        <svg className="icon icon-sm"><use href="/svg/sprites.svg#it-search"></use></svg>
                    </span>
                    <input 
                      type="text" 
                      className={`${inputClass} border-start-0`}
                      placeholder="Parole chiave (es. ciclabile, parco...)" 
                      name="q"
                      value={formData.q}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-check mt-2">
                    <input 
                      className="form-check-input custom-border bg-off-white" 
                      type="checkbox" 
                      id="titlesOnly" 
                      name="titlesOnly"
                      checked={formData.titlesOnly}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-muted small" htmlFor="titlesOnly">
                      Cerca solo nei titoli
                    </label>
                  </div>
                </div>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className={labelClass}>Tipo Contenuto</label>
                    <select className={selectClass} name="type" value={formData.type} onChange={handleChange}>
                      <option value="all">Tutto (Proposte e Sondaggi)</option>
                      <option value="proposta">Solo Proposte</option>
                      <option value="sondaggio">Solo Sondaggi</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className={labelClass}>Categoria</label>
                    <select className={selectClass} name="categoryCode" value={formData.categoryCode} onChange={handleChange}>
                      <option value="">Tutte le categorie</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.code}>
                          {cat.labels.it}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className={labelClass}>Autore</label>
                    <div className="input-group">
                        <span className={groupTextClass}>
                            <svg className="icon icon-sm"><use href="/svg/sprites.svg#it-user"></use></svg>
                        </span>
                        <input 
                        type="text" 
                        className={`${inputClass} border-start-0`}
                        placeholder="Nome utente" 
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                     {(!isPoll) && !isProposal && (
                         <div className="alert alert-light border small py-2 d-flex align-items-center mb-0 h-100 text-muted bg-off-white custom-border">
                            Seleziona un tipo specifico per filtrare per stato.
                         </div>
                     )}

                     {isProposal && (
                       <>
                         <label className={labelClass}>Stato Proposta</label>
                         <select className={selectClass} name="statusCode" value={formData.statusCode} onChange={handleChange}>
                            <option value="">Qualsiasi stato</option>
                            {statuses.map(status => (
                              <option key={status.id} value={status.code}>
                                {status.labels.it}
                              </option>
                            ))}
                         </select>
                       </>
                     )}

                     {isPoll && (
                       <>
                         <label className={labelClass}>Stato Sondaggio</label>
                         <select className={selectClass} name="isActive" value={formData.isActive} onChange={handleChange}>
                            <option value="">Tutti</option>
                            <option value="true">In corso (Aperti)</option>
                            <option value="false">Conclusi (Scaduti)</option>
                         </select>
                       </>
                     )}
                  </div>
                </div>
                {isProposal && (
                  <div className="mb-4 bg-light p-3 rounded-3 border border-secondary-subtle">
                    <label className={labelClass}>Intervallo Voti</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        className={`${inputClass} text-center`}
                        placeholder="Min" 
                        name="minVotes"
                        min="0"
                        value={formData.minVotes}
                        onChange={handleChange}
                      />
                      <span className="input-group-text bg-white border-top border-bottom border-secondary-subtle text-muted px-3">-</span>
                      <input 
                        type="number" 
                        className={`${inputClass} text-center`}
                        placeholder="Max" 
                        name="maxVotes"
                        min="0"
                        value={formData.maxVotes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
                <div className="mb-5">
                   <label className={labelClass}>Periodo Temporale</label>
                   <div className="row g-2">
                      <div className="col-6">
                          <input 
                            type="date" 
                            className={`${inputClass} text-muted`}
                            name="dateFrom"
                            value={formData.dateFrom}
                            onChange={handleChange}
                          />
                          <div className="form-text x-small">Data inizio</div>
                      </div>
                      <div className="col-6">
                           <input 
                            type="date" 
                            className={`${inputClass} text-muted`}
                            name="dateTo"
                            value={formData.dateTo}
                            onChange={handleChange}
                          />
                          <div className="form-text x-small">Data fine</div>
                      </div>
                   </div>
                </div>
                <div className="bg-light p-3 rounded-3 border border-secondary-subtle mb-4">
                  <div className="row g-3 align-items-center">
                     <div className="col-auto">
                        <span className="fw-bold text-secondary small text-uppercase ls-1">Ordina risultati per:</span>
                     </div>
                     <div className="col">
                        <select className="form-select form-select-sm bg-white border-secondary-subtle" name="sortBy" value={formData.sortBy} onChange={handleChange}>
                          <option value="date">Data creazione</option>
                          {isProposal && <option value="votes">Popolarità (Voti)</option>}
                          <option value="title">Titolo (A-Z)</option>
                        </select>
                     </div>
                     <div className="col">
                        <select className="form-select form-select-sm bg-white border-secondary-subtle" name="sortOrder" value={formData.sortOrder} onChange={handleChange}>
                          <option value="desc">Decrescente (Più recenti/alti)</option>
                          <option value="asc">Crescente (Meno recenti/bassi)</option>
                        </select>
                     </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                   <button 
                     type="button" 
                     className="btn btn-link text-muted text-decoration-none fw-medium"
                     onClick={() => router.back()}
                   >
                     Annulla
                   </button>
                   <button 
                     type="submit" 
                     className="btn btn-primary px-5 py-2 fw-bold shadow-sm rounded-3"
                     style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
                   >
                     Cerca
                   </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .ls-1 { letter-spacing: 1px; font-size: 0.75rem; }
        .x-small { font-size: 0.75rem; }
        
        .bg-off-white {
            background-color: #fafafa !important; 
        }

        .custom-border {
            border: 1px solid #ced4da !important; 
        }
        
        .input-group .input-group-text.custom-border {
            border-right: 0 !important;
        }
        .input-group .form-control.custom-border {
            border-left: 0 !important;
        }

        .form-control:focus, .form-select:focus, .form-check-input:focus {
           background-color: #ffffff !important; 
           border-color: ${theme.primary} !important;
           box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }
      `}</style>
    </div>
  )
}