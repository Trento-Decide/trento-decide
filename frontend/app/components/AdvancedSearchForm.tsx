"use client"

import { useState, type FormEvent, useEffect } from "react"
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

  useEffect(() => {
    if (formData.type === 'sondaggio') {
      setFormData(prev => ({ ...prev, minVotes: "", maxVotes: "", statusCode: "" }))
    } else if (formData.type === 'proposta') {
      setFormData(prev => ({ ...prev, isActive: "" }))
    }
  }, [formData.type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (formData.q) params.set("q", formData.q)
    if (formData.titlesOnly) params.set("titlesOnly", "true")
    if (formData.author) params.set("authorUsername", formData.author)
    if (formData.categoryCode) params.set("categoryCode", formData.categoryCode)
    if (formData.dateFrom) params.set("dateFrom", formData.dateFrom)
    if (formData.dateTo) params.set("dateTo", formData.dateTo)
    if (formData.type && formData.type !== "all") params.set("type", formData.type)
    
    if (formData.type !== 'sondaggio') {
      if (formData.statusCode) params.set("statusCode", formData.statusCode)
      if (formData.minVotes) params.set("minVotes", formData.minVotes)
      if (formData.maxVotes) params.set("maxVotes", formData.maxVotes)
    }

    if (formData.type !== 'proposta') {
       if (formData.isActive) params.set("isActive", formData.isActive)
    }
    
    if (formData.sortBy !== "date" || formData.sortOrder !== "desc") {
      params.set("sortBy", formData.sortBy)
      params.set("sortOrder", formData.sortOrder)
    }

    router.push(`/cerca?${params.toString()}`)
  }

  const isPoll = formData.type === 'sondaggio';
  const isProposal = formData.type === 'proposta';

  return (
    <div className="container py-5">
      <style jsx>{`
        .btn-theme { 
          background-color: ${theme.primary}; 
          border-color: ${theme.primary}; 
          color: #fff; 
        }
        .btn-theme:hover { 
          background-color: ${theme.dark}; 
          border-color: ${theme.dark}; 
          color: #fff;
        }
        .form-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #6c757d;
          margin-bottom: 0.5rem;
        }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          
          <div className="card shadow-sm border-0">
            <div className="card-header text-white p-4" style={{ backgroundColor: theme.primary }}>
              <h2 className="h4 mb-0 fw-bold d-flex align-items-center gap-2">
                <svg className="icon icon-white" style={{ width: 24, height: 24, fill: "currentColor" }} aria-hidden="true">
                  <use href="/svg/sprites.svg#it-search"></use>
                </svg>
                Ricerca Avanzata
              </h2>
              <p className="mb-0 opacity-75 small mt-1">Filtra i contenuti in base alle tue preferenze.</p>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="mb-4">
                  <div className="form-section-title">Cosa cerchi?</div>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Parole chiave (es. ciclabile, parco...)" 
                      name="q"
                      value={formData.q}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-check mt-2">
                    <input 
                      className="form-check-input" 
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

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-section-title">Tipo Contenuto</div>
                    <select 
                      className="form-select" 
                      name="type" 
                      value={formData.type} 
                      onChange={handleChange}
                    >
                      <option value="all">Tutto (Proposte e Sondaggi)</option>
                      <option value="proposta">Solo Proposte</option>
                      <option value="sondaggio">Solo Sondaggi</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <div className="form-section-title">Categoria</div>
                    <select 
                      className="form-select" 
                      name="categoryCode" 
                      value={formData.categoryCode} 
                      onChange={handleChange}
                    >
                      <option value="">Tutte le categorie</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.code}>
                          {cat.labels.it}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  
                  <div className="col-md-6">
                    <div className="form-section-title">Autore</div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nome utente..." 
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-md-6">
                     
                     {!isPoll && (
                       <>
                         <div className="form-section-title">Stato Proposta</div>
                         <select 
                           className="form-select mb-2" 
                           name="statusCode" 
                           value={formData.statusCode} 
                           onChange={handleChange}
                           disabled={isPoll}
                         >
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
                         <div className="form-section-title">Stato Sondaggio</div>
                         <select 
                           className="form-select" 
                           name="isActive" 
                           value={formData.isActive} 
                           onChange={handleChange}
                         >
                            <option value="">Tutti</option>
                            <option value="true">In corso (Aperti)</option>
                            <option value="false">Conclusi (Scaduti)</option>
                         </select>
                       </>
                     )}
                  </div>
                </div>

                <hr className="text-muted opacity-25 my-4"/>

                {!isPoll && (
                  <div className="mb-4">
                    <div className="form-section-title">Numero di Voti (Solo Proposte)</div>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">Min</span>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="0" 
                        name="minVotes"
                        min="0"
                        value={formData.minVotes}
                        onChange={handleChange}
                      />
                      <span className="input-group-text bg-light text-muted border-start-0 border-end-0">Max</span>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Es. 1000" 
                        name="maxVotes"
                        min="0"
                        value={formData.maxVotes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                   <div className="form-section-title">Intervallo Temporale</div>
                   <div className="row g-2">
                      <div className="col-6">
                        <div className="form-floating">
                          <input 
                            type="date" 
                            className="form-control" 
                            id="dateFrom" 
                            name="dateFrom"
                            value={formData.dateFrom}
                            onChange={handleChange}
                          />
                          <label htmlFor="dateFrom">Da</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-floating">
                           <input 
                            type="date" 
                            className="form-control" 
                            id="dateTo" 
                            name="dateTo"
                            value={formData.dateTo}
                            onChange={handleChange}
                          />
                          <label htmlFor="dateTo">A</label>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="mb-4 bg-light p-3 rounded">
                  <div className="row g-3 align-items-center">
                     <div className="col-auto">
                        <label className="fw-bold text-secondary small mb-0">Ordina per:</label>
                     </div>
                     <div className="col">
                        <select className="form-select form-select-sm" name="sortBy" value={formData.sortBy} onChange={handleChange}>
                          <option value="date">Data creazione</option>
                          {!isPoll && <option value="votes">Popolarità (Voti)</option>}
                          <option value="title">Titolo (A-Z)</option>
                        </select>
                     </div>
                     <div className="col">
                        <select className="form-select form-select-sm" name="sortOrder" value={formData.sortOrder} onChange={handleChange}>
                          <option value="desc">Decrescente (Più recenti/alti)</option>
                          <option value="asc">Crescente (Meno recenti/bassi)</option>
                        </select>
                     </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5">
                   <button 
                     type="button" 
                     className="btn btn-outline-secondary px-4"
                     onClick={() => router.back()}
                   >
                     Annulla
                   </button>
                   <button 
                     type="submit" 
                     className="btn btn-theme px-5 fw-bold shadow-sm"
                   >
                     Applica Filtri
                   </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}