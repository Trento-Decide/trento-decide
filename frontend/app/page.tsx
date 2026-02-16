import Link from "next/link"
import { getCategories, getPolls, getProposals } from "@/lib/api"
import UserGreeting from "@/app/components/UserGreeting"
import ProposalCard from "@/app/components/ProposalCard"
import PollCard from "@/app/components/PollCard"
import { theme } from "@/lib/theme"
import { PollSearchItem } from "../../shared/models"

export const revalidate = 60 

export default async function HomePage() {
  const [categoriesRes, proposalsRes, pollsRes] = await Promise.allSettled([
    getCategories(),
    getProposals({ limit: 3, sortOrder: 'desc', sortBy: 'date' }),
    getPolls({ limit: 3, isActive: true }) 
  ])

  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : []
  const recentProposals = proposalsRes.status === 'fulfilled' ? proposalsRes.value : []
  let activePolls: PollSearchItem[] = []
  if (pollsRes.status === 'fulfilled') {
    activePolls = pollsRes.value
  }

  return (
    <div style={{ backgroundColor: "#f2f7fc", minHeight: "100vh" }}>
    <div className="container py-4">
      
      <UserGreeting />

      <div className="row g-4">
        <div className="col-lg-8">
          
          {activePolls.length > 0 && (
            <section className="mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 fw-bold mb-0">Sondaggi in corso</h2>
                <Link 
                  href="/cerca?type=sondaggio" 
                  className="small fw-bold link-hover-underline" 
                  style={{ color: theme.primary }}
                >
                  Vedi tutti
                </Link>
              </div>
              <div className="row g-3">
                {activePolls.map((poll) => (
                  <div key={poll.id} className="col-md-6">
                    <PollCard poll={poll} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h4 fw-bold mb-0">Proposte recenti</h2>
              <Link 
                href="/proposte" 
                className="small fw-bold link-hover-underline" 
                style={{ color: theme.primary }}
              >
                Vedi tutte
              </Link>
            </div>
            
            <div>
              {recentProposals.map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          </section>
        </div>

        <div className="col-lg-4">
          
          <div className="card border-0 rounded-3 shadow-sm mb-4 overflow-hidden">
            <div className="card-header bg-white fw-bold py-3 border-bottom-0 ps-4">
              Esplora per Categoria
            </div>
            <div className="card-body pt-0 ps-4 pe-4 pb-4">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/cerca?category=${cat.code}`}
                    className="btn rounded-3 cat-btn px-3"
                    style={{ 
                      '--cat-color': cat.colour || '#6c757d',
                      fontSize: '0.85rem'
                    } as React.CSSProperties}
                  >
                    {cat.labels.it}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="card border-0 rounded-3 shadow-sm" style={{ backgroundColor: '#eef6f6' }}>
            <div className="card-body p-4">
              
              <h3 className="h6 text-uppercase fw-bold mb-4" style={{ color: '#4a6f75', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                La città in numeri
              </h3>
              
              <div className="d-flex flex-column gap-4">
                
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-bg bg-white text-primary shadow-sm">
                     <svg className="icon" aria-hidden="true" style={{width: 24, height: 24, fill: theme.primary }}>
                        <use href="/svg/sprites.svg#it-presentation"></use>
                     </svg>
                  </div>
                  <div>
                    <div className="fs-4 fw-bold lh-1" style={{ color: '#2c4b52' }}>142</div>
                    <div className="small fw-medium" style={{ color: '#688a91' }}>Proposte attive</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-bg bg-white shadow-sm" style={{ color: '#d12929' }}>
                     <svg className="icon" aria-hidden="true" style={{width: 24, height: 24, fill: 'currentColor'}}>
                        <use href="/svg/sprites.svg#it-star-outline"></use>
                     </svg>
                  </div>
                  <div>
                    <div className="fs-4 fw-bold lh-1" style={{ color: '#2c4b52' }}>3.5k</div>
                    <div className="small fw-medium" style={{ color: '#688a91' }}>Voti espressi</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-bg bg-white shadow-sm" style={{ color: '#2d8a4e' }}>
                     <svg className="icon" aria-hidden="true" style={{width: 24, height: 24, fill: 'currentColor'}}>
                        <use href="/svg/sprites.svg#it-user"></use>
                     </svg>
                  </div>
                  <div>
                    <div className="fs-4 fw-bold lh-1" style={{ color: '#2c4b52' }}>890</div>
                    <div className="small fw-medium" style={{ color: '#688a91' }}>Cittadini iscritti</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .link-hover-underline {
          text-decoration: none;
          transition: text-decoration 0.2s;
        }
        .link-hover-underline:hover {
          text-decoration: underline;
        }

        .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
        
        .stat-icon-bg {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-btn {
          background-color: color-mix(in srgb, var(--cat-color), white 88%);
          color: color-mix(in srgb, var(--cat-color), black 20%);
          border: 1px solid color-mix(in srgb, var(--cat-color), white 80%);
          font-weight: 600;
          letter-spacing: -0.3px;
          transition: all 0.2s ease;
        }

        .cat-btn:hover {
          background-color: color-mix(in srgb, var(--cat-color), white 80%);
          color: color-mix(in srgb, var(--cat-color), black 40%);
        }
      `}</style>
    </div>
    </div>
  )
}
