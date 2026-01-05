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

export default function SearchFilters({ mobileMode = false }: { mobileMode?: boolean }) {
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

  return <SearchFiltersInner key={searchParams?.toString() ?? ""} initial={initial} mobileMode={mobileMode} />
}

function SearchFiltersInner({ initial, mobileMode }: { initial: Filters, mobileMode: boolean }) {
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

    Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
             if (value === true) params.set(key, "true")
        } 
        else if (typeof value === 'string') {
             if (value.trim() !== "") params.set(key, value.trim())
        }
    })

    router.push(`/cerca?${params.toString()}`)
    
    if (mobileMode) {
        const closeBtn = document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLElement;
        if(closeBtn) closeBtn.click();
    }
  }

  const resetFilters = () => {
    setFilters({
      q: "", author: "", titlesOnly: false, category: "",
      minVotes: "", maxVotes: "", dateFrom: "", dateTo: "", status: "",
    })
    router.push("/cerca")
  }

  const inputClass = "form-control bg-off-white custom-border";
  const selectClass = "form-select bg-off-white custom-border";
  const groupTextClass = "input-group-text bg-off-white custom-border text-muted";

  return (
    <div className={!mobileMode ? 'sticky-top' : ''} style={{ top: '24px' }}>
      
      <div className={`card border-0 ${!mobileMode ? 'shadow-sm rounded-3' : ''} bg-white`}>
        <div className="card-body p-4">
          
          {!mobileMode && (
            <div className="d-flex align-items-center mb-4 text-primary">
                <svg className="icon icon-sm me-2"><use href="/svg/sprites.svg#it-funnel"></use></svg>
                <h5 className="fw-bold mb-0" style={{ color: theme.primary }}>Filtra Ricerca</h5>
            </div>
          )}

          <form onSubmit={applyFilters}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted ls-1">Parola chiave</label>
              <div className="input-group">
                 <span className={`${groupTextClass} border-end-0`}>
                    <svg className="icon icon-xs"><use href="/svg/sprites.svg#it-search"></use></svg>
                 </span>
                 <input
                    type="text"
                    name="q"
                    className={`${inputClass} border-start-0`}
                    placeholder="Cerca..."
                    value={filters.q}
                    onChange={handleChange}
                  />
              </div>
              <div className="form-check mt-2">
                <input
                  className="form-check-input custom-border bg-off-white"
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

            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted ls-1">Categoria</label>
              <select name="category" className={selectClass} value={filters.category} onChange={handleChange}>
                <option value="">Tutte le categorie</option>
                <option value="urbanistica">Urbanistica</option>
                <option value="ambiente">Ambiente</option>
                <option value="sicurezza">Sicurezza</option>
                <option value="cultura">Cultura</option>
                <option value="istruzione">Istruzione</option>
                <option value="innovazione">Innovazione</option>
                <option value="mobilita_trasporti">Mobilità</option>
                <option value="welfare">Welfare</option>
                <option value="sport">Sport</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted ls-1">Stato Proposta</label>
              <select name="status" className={selectClass} value={filters.status} onChange={handleChange}>
                <option value="">Qualsiasi stato</option>
                <option value="bozza">Bozza</option>
                <option value="pubblicata">Pubblicata</option>
                <option value="in_valutazione">In valutazione</option>
                <option value="approvata">Approvata</option>
                <option value="respinta">Respinta</option>
                <option value="completata">Completata</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted ls-1">Voti (Min - Max)</label>
              <div className="d-flex align-items-center gap-2">
                <input type="number" name="minVotes" className={`${inputClass} text-center`} placeholder="0" value={filters.minVotes} onChange={handleChange} />
                <span className="text-muted">-</span>
                <input type="number" name="maxVotes" className={`${inputClass} text-center`} placeholder="∞" value={filters.maxVotes} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted ls-1">Autore</label>
              <div className="input-group">
                 <span className={`${groupTextClass} border-end-0`}>
                    <svg className="icon icon-xs"><use href="/svg/sprites.svg#it-user"></use></svg>
                 </span>
                 <input type="text" name="author" className={`${inputClass} border-start-0`} placeholder="Nome utente" value={filters.author} onChange={handleChange} />
              </div>
            </div>
            <div className="mb-4">
               <label className="form-label small fw-bold text-uppercase text-muted ls-1">Periodo</label>
               <div className="d-flex flex-column gap-2">
                  <input type="date" name="dateFrom" className={`${inputClass} small`} value={filters.dateFrom} onChange={handleChange} />
                  <input type="date" name="dateTo" className={`${inputClass} small`} value={filters.dateTo} onChange={handleChange} />
               </div>
            </div>
            <div className="d-grid gap-2 mt-5">
              <button type="submit" className="btn btn-primary fw-bold shadow-sm py-2" style={{ backgroundColor: theme.primary, borderColor: theme.primary }}>
                Applica Filtri
              </button>
              <button type="button" onClick={resetFilters} className="btn btn-outline-dark py-2 fw-medium">
                Cancella tutto
              </button>
            </div>

          </form>
        </div>
      </div>
      
      <style jsx global>{`
        .ls-1 { letter-spacing: 1px; font-size: 0.7rem; }
        
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