import Link from "next/link"
import { getCategories, getProposals, globalSearch } from "@/lib/api"
import UserGreeting from "@/app/components/UserGreeting"
import ProposalCard from "@/app/components/ProposalCard"
import PollCard from "@/app/components/PollCard"
import { theme } from "@/lib/theme"
import { Category, ProposalSearchItem } from "../../shared/models"

export const revalidate = 60 

export default async function HomePage() {
  const [categoriesRes, proposalsRes, pollsRes] = await Promise.allSettled([
    getCategories(),
    getProposals({ limit: 3, sortOrder: 'desc', sortBy: 'date' }),
    globalSearch({ type: 'sondaggio', limit: 3, isActive: true })
  ])

  const categories: Category[] = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : []
  const recentProposals: ProposalSearchItem[] = proposalsRes.status === 'fulfilled' ? proposalsRes.value : []
  const activePolls = (pollsRes.status === 'fulfilled' ? pollsRes.value.data : []) as any[]

  return (
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
          
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white fw-bold py-3 border-bottom-0">
              Esplora per Categoria
            </div>
            <div className="card-body pt-0">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/cerca?category=${cat.code}`}
                    className="btn btn-sm rounded-pill cat-btn fw-bold"
                    style={{ '--cat-color': cat.colour || '#6c757d' } as React.CSSProperties}
                  >
                    {cat.labels.it}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body p-4">
              <h3 className="h5 fw-bold mb-3">La città in numeri</h3>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 d-flex justify-content-between">
                  <span>Proposte attive</span>
                  <span className="fw-bold">142</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <span>Voti espressi</span>
                  <span className="fw-bold">3.5k</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Cittadini iscritti</span>
                  <span className="fw-bold">890</span>
                </li>
              </ul>
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cat-btn {
          background-color: color-mix(in srgb, var(--cat-color), white 90%);
          color: var(--cat-color);
          border: 1px solid var(--cat-color);
          transition: all 0.2s ease-in-out;
        }

        .cat-btn:hover {
          background-color: var(--cat-color);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  )
}