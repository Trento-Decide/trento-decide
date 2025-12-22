"use client"

import { useState, useId } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { theme } from "@/lib/theme"

type Filters = {
  q: string
  author: string
  titlesOnly: boolean
  category: string
  minVotes: string
  maxVotes: string
  dateFrom: string
  dateTo: string
  status: string
}

export default function SearchFilters() {
  const searchParams = useSearchParams()

  const initial: Filters = {
    q: searchParams?.get("q") ?? "",
    author: searchParams?.get("author") ?? "",
    titlesOnly: searchParams?.get("titlesOnly") === "true",
    category: searchParams?.get("category") ?? "",
    minVotes: searchParams?.get("minVotes") ?? "",
    maxVotes: searchParams?.get("maxVotes") ?? "",
    dateFrom: searchParams?.get("dateFrom") ?? "",
    dateTo: searchParams?.get("dateTo") ?? "",
    status: searchParams?.get("status") ?? "",
  }

  return <SearchFiltersInner key={searchParams?.toString() ?? ""} initial={initial} />
}

function SearchFiltersInner({ initial }: { initial: Filters }) {
  const router = useRouter()
  const uniqueId = useId()

  const [filters, setFilters] = useState<Filters>(initial)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFilters(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (filters.q.trim()) params.set("q", filters.q.trim())
    if (filters.author.trim()) params.set("author", filters.author.trim())
    if (filters.titlesOnly) params.set("titlesOnly", "true")
    if (filters.category) params.set("category", filters.category)
    if (filters.status) params.set("status", filters.status)
    if (filters.minVotes) params.set("minVotes", filters.minVotes)
    if (filters.maxVotes) params.set("maxVotes", filters.maxVotes)
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
    if (filters.dateTo) params.set("dateTo", filters.dateTo)

    router.push(`/cerca?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      q: "",
      author: "",
      titlesOnly: false,
      category: "",
      minVotes: "",
      maxVotes: "",
      dateFrom: "",
      dateTo: "",
      status: "",
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
              checked={filters.titlesOnly}
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
          <select name="category" className="form-select form-select-sm" value={filters.category} onChange={handleChange}>
            <option value="">Tutte</option>
            <option value="urbanistica">Urbanistica</option>
            <option value="ambiente">Ambiente</option>
            <option value="sicurezza">Sicurezza</option>
            <option value="cultura">Cultura</option>
            <option value="istruzione">Istruzione</option>
            <option value="innovazione">Innovazione</option>
            <option value="mobilita_trasporti">Mobilità e Trasporti</option>
            <option value="welfare">Welfare</option>
            <option value="sport">Sport</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Stato</label>
          <select name="status" className="form-select form-select-sm" value={filters.status} onChange={handleChange}>
            <option value="">Qualsiasi</option>
            <option value="bozza">Bozza</option>
            <option value="pubblicata">Pubblicata</option>
            <option value="in_valutazione">In valutazione</option>
            <option value="approvata">Approvata</option>
            <option value="respinta">Respinta</option>
            <option value="in_attuazione">In attuazione</option>
            <option value="completata">Completata</option>
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
              <label className="form-label small text-muted mb-0" htmlFor={`dateFrom-${uniqueId}`}>
                Da
              </label>
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
              <label className="form-label small text-muted mb-0" htmlFor={`dateTo-${uniqueId}`}>
                A
              </label>
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
          <button type="submit" className="btn btn-theme btn-sm">
            Applica Filtri
          </button>
          <button type="button" onClick={resetFilters} className="btn btn-outline-secondary btn-sm">
            Resetta
          </button>
        </div>
      </form>
    </div>
  )
}