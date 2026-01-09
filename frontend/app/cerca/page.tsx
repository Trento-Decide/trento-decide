import Link from "next/link"
import { globalSearch } from "@/lib/api"
import SearchFilters from "@/app/components/SearchFilters"
import SearchResultCard from "@/app/components/SearchResultCard" 
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
    statusCode: getString(resolvedParams.status),
    dateFrom: getString(resolvedParams.dateFrom),
    dateTo: getString(resolvedParams.dateTo),
    sortBy: getString(resolvedParams.sortBy) as GlobalFilters["sortBy"],
    sortOrder: getString(resolvedParams.sortOrder) as GlobalFilters["sortOrder"],
    minVotes: resolvedParams.minVotes ? Number(resolvedParams.minVotes) : undefined,
    maxVotes: resolvedParams.maxVotes ? Number(resolvedParams.maxVotes) : undefined,
  }

  const { data: results } = await globalSearch(filters)

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div className="container py-4 py-lg-5">
            <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4">
                <div>
                    <h1 className="fw-bold mb-1" style={{ color: theme.primary }}>
                        {filters.q ? `Risultati per "${filters.q}"` : "Esplora Proposte"}
                    </h1>
                    <p className="text-muted mb-0 small">
                        Visualizzati {results.length} risultati
                    </p>
                </div>

                <div className="d-lg-none mt-3">
                    <button 
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm" 
                        style={{ backgroundColor: 'white', color: theme.primary, border: `1px solid ${theme.primary}` }}
                        type="button" 
                        data-bs-toggle="offcanvas" 
                        data-bs-target="#searchFiltersOffcanvas" 
                        aria-controls="searchFiltersOffcanvas"
                    >
                        <svg className="icon icon-sm"><use href="/svg/sprites.svg#it-funnel"></use></svg>
                        Filtri Avanzati
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-3 d-none d-lg-block">
                    <SearchFilters />
                </div>
                <div className="col-12 col-lg-9">
                    {results.length === 0 ? (
                        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                            <div className="mb-3 p-4 rounded-circle bg-light d-inline-block">
                                <svg className="icon icon-xl text-muted"><use href="/svg/sprites.svg#it-search"></use></svg>
                            </div>
                            <h3 className="h5 fw-bold text-dark">Nessun risultato trovato</h3>
                            <p className="text-muted mx-auto" style={{maxWidth: '400px'}}>
                                Modifica i filtri o prova una parola chiave diversa.
                            </p>
                            <Link href="/cerca" className="btn btn-outline-primary btn-sm mt-2 rounded-3 px-4">
                                Resetta ricerca
                            </Link>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {results.map((item: GlobalSearchItem) => (
                                <SearchResultCard key={`${item.type}-${item.id}`} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="offcanvas offcanvas-start" tabIndex={-1} id="searchFiltersOffcanvas" aria-labelledby="searchFiltersOffcanvasLabel">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold" id="searchFiltersOffcanvasLabel" style={{ color: theme.primary }}>Filtra Ricerca</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <SearchFilters mobileMode={true} />
                </div>
            </div>

        </div>
    </div>
  )
}