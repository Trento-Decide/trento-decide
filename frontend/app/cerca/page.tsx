import Link from "next/link"
import { globalSearch } from "@/lib/api"
import SearchFilters from "@/app/components/SearchFilters"
import type { GlobalFilters, GlobalSearchItem } from "../../../shared/models" 
import { theme } from "@/lib/theme"

export const dynamic = 'force-dynamic'

function getString(param: string | string[] | undefined): string | undefined {
  return typeof param === "string" ? param : undefined
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  
  const resolvedParams = await searchParams;

  const filters: GlobalFilters = {
    q: getString(resolvedParams.q) ?? "",
    titlesOnly: resolvedParams.titlesOnly === "true",
    type: (getString(resolvedParams.type) as GlobalFilters["type"]) ?? "all",
    
    authorUsername: getString(resolvedParams.author),
    categoryCode: getString(resolvedParams.category),
    
    dateFrom: getString(resolvedParams.dateFrom),
    dateTo: getString(resolvedParams.dateTo),
    
    sortBy: getString(resolvedParams.sortBy) as GlobalFilters["sortBy"],
    sortOrder: getString(resolvedParams.sortOrder) as GlobalFilters["sortOrder"],
  }

  const { data: results } = await globalSearch(filters)

  return (
    <div className="container py-4 py-lg-5">
      <div className="row">
        <div className="col-12 d-lg-none mb-3">
          <h1 className="fw-bold fs-3" style={{ color: theme.primary }}>Risultati Ricerca</h1>
          <button 
            className="btn w-100 mt-2 d-flex align-items-center justify-content-center" 
            style={{ borderColor: theme.primary, color: theme.primary }}
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mobileFilters"
            aria-expanded="false"
            aria-controls="mobileFilters"
          >
            <span>Mostra Filtri Avanzati</span>
            <svg className="icon icon-sm ms-2" style={{ width: 16, height: 16, fill: "currentColor", stroke: "currentColor", strokeWidth: 1 }} aria-hidden="true">
              <use href="/svg/sprites.svg#it-expand"></use>
            </svg>
          </button>
          <div className="collapse mt-3" id="mobileFilters">
             <SearchFilters />
          </div>
        </div>

        <div className="col-lg-3 d-none d-lg-block">
          <SearchFilters />
        </div>

        <div className="col-12 col-lg-9">
          <div className="d-none d-lg-block mb-4 border-bottom pb-2">
            <h1 className="fw-bold" style={{ color: theme.primary }}>
              {filters.q ? `Risultati per "${filters.q}"` : "Tutti i risultati"}
            </h1>
            <p className="text-muted mb-0">
              Trovati {results.length} risultati
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <h3 className="text-muted">Nessun risultato trovato</h3>
              <p>Prova a modificare i filtri o la parola chiave.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {results.map((item: GlobalSearchItem) => (
                <div key={`${item.type}-${item.id}`} className="card shadow-sm border-0 hover-effect">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span 
                        className="badge text-white" 
                        style={{ backgroundColor: item.type === 'sondaggio' ? '#17a2b8' : theme.primary }}
                      >
                        {item.type === 'sondaggio' ? 'Sondaggio' : 'Proposta'}
                      </span>
                      {item.date && (
                        <div className="d-flex align-items-center text-muted small">
                          <svg className="icon icon-xs me-1" style={{ width: 16, height: 16, fill: "currentColor" }} aria-hidden="true">
                            <use href="/svg/sprites.svg#it-calendar"></use>
                          </svg>
                          <span className="visually-hidden">Data creazione:</span>
                          <span>{item.date}</span>
                        </div>
                      )}
                    </div>

                    <h5 className="card-title fw-bold">
                      <Link 
                        href={item.type === 'sondaggio' ? `/sondaggi/${item.id}` : `/proposte/${item.id}`} 
                        className="text-decoration-none text-dark stretched-link"
                      >
                        {item.title}
                      </Link>
                    </h5>
                    
                    <p className="card-text text-secondary mb-3">
                      {item.description && item.description.length > 180 
                        ? item.description.substring(0, 180) + "..." 
                        : item.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
                       <div className="d-flex align-items-center gap-2 small text-muted">
                          {item.author && (
                            <>
                              <svg className="icon icon-sm" style={{width:16, height:16, fill:"currentColor"}}><use href="/svg/sprites.svg#it-user"></use></svg>
                              <span>{item.author}</span>
                            </>
                          )}
                          {item.category && (
                             <>
                               <span className="mx-1">•</span>
                               <span className="fw-semibold" style={{ color: theme.primary }}>{item.category}</span>
                             </>
                          )}
                       </div>
                       
                       {'voteValue' in item && item.voteValue !== undefined && (
                         <div className="fw-bold" style={{ color: theme.primary }}>
                           {item.voteValue} {item.voteValue === 1 ? 'voto' : 'voti'}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .hover-effect { transition: transform 0.2s, box-shadow 0.2s; }
        .hover-effect:hover { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
      `}</style>
    </div>
  )
}