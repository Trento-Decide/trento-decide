"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { theme } from "@/lib/theme"

export default function AdvancedSearchPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    q: "",
    titlesOnly: false,
    author: "",
    category: "",
    status: "", // "Open", "Closed", ecc.
    minVotes: "",
    maxVotes: "",
    dateFrom: "",
    dateTo: "",
    type: "all", // "all", "proposta", "sondaggio"
    sortBy: "date",
    sortOrder: "desc"
  })

  const categories = [
    "Urbanistica",
    "Ambiente",
    "Sicurezza",
    "Cultura",
    "Istruzione",
    "Innovazione",
    "Mobilità e Trasporti",
    "Welfare",
    "Sport"
  ]

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
    if (formData.author) params.set("author", formData.author)
    if (formData.category) params.set("category", formData.category)
    if (formData.status) params.set("status", formData.status)
    if (formData.minVotes) params.set("minVotes", formData.minVotes)
    if (formData.maxVotes) params.set("maxVotes", formData.maxVotes)
    if (formData.dateFrom) params.set("dateFrom", formData.dateFrom)
    if (formData.dateTo) params.set("dateTo", formData.dateTo)
    if (formData.type && formData.type !== "all") params.set("type", formData.type)
    
    if (formData.sortBy !== "date" || formData.sortOrder !== "desc") {
      params.set("sortBy", formData.sortBy)
      params.set("sortOrder", formData.sortOrder)
    }

    router.push(`/cerca?${params.toString()}`)
  }

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
              <p className="mb-0 opacity-75 small mt-1">Filtra proposte e sondaggi in base alle tue preferenze.</p>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary text-uppercase small">Parole chiave</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Cosa stai cercando? (es. ciclabile, parco...)" 
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
                    <label className="form-label fw-bold text-secondary text-uppercase small">Tipo Contenuto</label>
                    <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                      <option value="all">Tutto (Proposte e Sondaggi)</option>
                      <option value="proposta">Solo Proposte</option>
                      <option value="sondaggio">Solo Sondaggi</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary text-uppercase small">Categoria</label>
                    <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                      <option value="">Tutte le categorie</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary text-uppercase small">Autore</label>
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
                     <label className="form-label fw-bold text-secondary text-uppercase small">Stato</label>
                     <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                        <option value="">Qualsiasi stato</option>
                        <option value="Open">Aperta / In corso</option>
                        <option value="Closed">Chiusa / Terminata</option>
                     </select>
                  </div>
                </div>

                <hr className="text-muted opacity-25 my-4"/>

                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary text-uppercase small">Numero di Voti</label>
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

                <div className="mb-4">
                   <label className="form-label fw-bold text-secondary text-uppercase small">Intervallo Temporale</label>
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
                        <label className="fw-bold text-secondary small mb-0">Ordina risultati per:</label>
                     </div>
                     <div className="col">
                        <select className="form-select form-select-sm" name="sortBy" value={formData.sortBy} onChange={handleChange}>
                          <option value="date">Data creazione</option>
                          <option value="votes">Popolarità (Voti)</option>
                          <option value="title">Titolo (A-Z)</option>
                        </select>
                     </div>
                     <div className="col">
                        <select className="form-select form-select-sm" name="sortOrder" value={formData.sortOrder} onChange={handleChange}>
                          <option value="desc">Decrescente (9-0, Z-A)</option>
                          <option value="asc">Crescente (0-9, A-Z)</option>
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
                      className="btn btn-theme px-5 fw-bold"
                   >
                     Cerca
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