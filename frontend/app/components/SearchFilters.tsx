"use client"

import { useState, useEffect, useId } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { theme } from "@/lib/theme"

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const uniqueId = useId() // Generate unique ID for this instance

  const [filters, setFilters] = useState({
    q: "",
    author: "",
    titlesOnly: false,
    category: "",
    minVotes: "",
    maxVotes: "",
    dateFrom: "",
    dateTo: "",
    status: ""
  })

  useEffect(() => {
    setFilters({
      q: searchParams?.get("q") ?? "",
      author: searchParams?.get("author") ?? "",
      titlesOnly: searchParams?.get("titlesOnly") === "true",
      category: searchParams?.get("category") ?? "",
      minVotes: searchParams?.get("minVotes") ?? "",
      maxVotes: searchParams?.get("maxVotes") ?? "",
      dateFrom: searchParams?.get("dateFrom") ?? "",
      dateTo: searchParams?.get("dateTo") ?? "",
      status: searchParams?.get("status") ?? ""
    })
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value))
      }
    })

    router.push(`/cerca?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      q: "", author: "", titlesOnly: false, category: "",
      minVotes: "", maxVotes: "", dateFrom: "", dateTo: "", status: ""
    })
    router.push("/cerca")
  }

  return (
    <div className="card shadow-sm border-0 p-3" style={{ backgroundColor: "#f8f9fa" }}>
      <style jsx>{`
        .text-theme { color: ${theme.primary} !important; }
        .btn-theme { 
          background-color: ${theme.primary}; 
          border-color: ${theme.primary}; 
          color: #fff; 
        }
        .btn-theme:hover { 
          background-color: ${theme.dark}; 
          border-color: ${theme.dark}; 
        }
      `}</style>
      <h5 className="mb-3 fw-bold text-theme">Filtri Ricerca</h5>
      <form onSubmit={applyFilters}>
        
        <div className="mb-3">
          <label className="form-label small fw-bold">Parola chiave</label>
          <input 
            type="text" 
            name="q" 
            className="form-control form-control-sm" 
            placeholder="Es. Pista ciclabile..." 
            value={filters.q} 
            onChange={handleChange} 
          />
          <div className="form-check mt-1">
            <input 
              className="form-check-input" 
              type="checkbox" 
              name="titlesOnly" 
              id={`sf-titlesOnly-${uniqueId}`} 
              checked={filters.titlesOnly as boolean} 
              onChange={handleChange} 
            />
            <label className="form-check-label small text-muted" htmlFor={`sf-titlesOnly-${uniqueId}`}>
              Cerca solo nei titoli
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Autore</label>
          <input 
            type="text" 
            name="author" 
            className="form-control form-control-sm" 
            placeholder="Nome utente" 
            value={filters.author} 
            onChange={handleChange} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Categoria</label>
          <select 
            name="category" 
            className="form-select form-select-sm" 
            value={filters.category} 
            onChange={handleChange}
          >
            <option value="">Tutte</option>
            <option value="Urbanistica">Urbanistica</option>
            <option value="Ambiente">Ambiente</option>
            <option value="Sicurezza">Sicurezza</option>
            <option value="Cultura">Cultura</option>
            <option value="Istruzione">Istruzione</option>
            <option value="Innovazione">Innovazione</option>
            <option value="Mobilità e Trasporti">Mobilità e Trasporti</option>
            <option value="Welfare">Welfare</option>
            <option value="Sport">Sport</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Stato</label>
          <select 
            name="status" 
            className="form-select form-select-sm" 
            value={filters.status} 
            onChange={handleChange}
          >
            <option value="">Qualsiasi</option>
            <option value="Open">Aperta</option>
            <option value="Closed">Chiusa</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Numero Voti</label>
          <div className="input-group input-group-sm">
            <input 
              type="number" 
              name="minVotes" 
              className="form-control" 
              placeholder="Min" 
              value={filters.minVotes} 
              onChange={handleChange} 
            />
            <span className="input-group-text">-</span>
            <input 
              type="number" 
              name="maxVotes" 
              className="form-control" 
              placeholder="Max" 
              value={filters.maxVotes} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Data Creazione</label>
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label small text-muted mb-0" htmlFor={`dateFrom-${uniqueId}`}>Da</label>
              <input 
                type="date" 
                id={`dateFrom-${uniqueId}`}
                name="dateFrom" 
                className="form-control form-control-sm" 
                value={filters.dateFrom} 
                onChange={handleChange} 
              />
            </div>
            <div className="col-6">
              <label className="form-label small text-muted mb-0" htmlFor={`dateTo-${uniqueId}`}>A</label>
              <input 
                type="date" 
                id={`dateTo-${uniqueId}`}
                name="dateTo" 
                className="form-control form-control-sm" 
                value={filters.dateTo} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-theme btn-sm">Applica Filtri</button>
          <button type="button" onClick={resetFilters} className="btn btn-outline-secondary btn-sm">Resetta</button>
        </div>
      </form>
    </div>
  )
}