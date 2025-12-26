"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { theme } from "@/lib/theme"
import UserMenu from "@/app/components/UserMenu"
import SearchBox from "@/app/components/SearchBox"

const NAV_LINKS = [
  { href: "/popolari", label: "Popolari", bold: true },
  { href: "/novita", label: "Novità" },
  { href: "/proposte", label: "Proposte" },
  { href: "/proposte/editor", label: "Crea proposta" },
  { href: "/regolamento", label: "Regolamento" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState("")

  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (!pathname) return false
    if (pathname === href) return true
    if (!pathname.startsWith(`${href}/`)) return false

    // If the next path segment corresponds to another top-level nav link (e.g. "/proposte/editor"),
    // prefer that child link and don't mark the parent as active.
    const nextSegment = pathname.slice(href.length + 1).split("/")[0]
    if (NAV_LINKS.some((l) => l.href === `${href}/${nextSegment}`)) return false

    return true
  }

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobileSearch.trim()) return
    router.push(`/cerca?q=${encodeURIComponent(mobileSearch.trim())}`)
    setIsMenuOpen(false)
  }

  return (
    <header className="shadow-none" style={{ backgroundColor: theme.primary, position: 'relative' }}>
      <style jsx>{`
        :global(.nav-link-minimal) {
          text-decoration: none !important;
          color: ${theme.text.light} !important;
          padding: 5px 0;
          margin: 0;
          font-weight: 500;
          font-size: 0.95rem;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease-in-out;
        }

        /* Use border-bottom as the single visual underline to avoid double lines */
        :global(.nav-link-minimal:hover) {
          color: ${theme.text.light} !important;
          border-bottom-color: ${theme.text.light};
        }

        :global(.nav-link-minimal.active) {
          color: ${theme.text.light} !important;
          font-weight: 700;
          border-bottom-color: ${theme.text.light};
        }

        .hamburger-lines line { stroke: #e0e0e0; stroke-width: 1.5; }
        .hamburger-btn:hover .hamburger-lines line { stroke: ${theme.text.light}; }

        .mobile-search-input {
          color: ${theme.text.dark} !important; background-color: #ffffff !important; border: 1px solid #ced4da !important;
          width: 100%; height: 40px; border-radius: 8px; padding-left: 40px; outline: none;
        }
        .mobile-search-input::placeholder { color: ${theme.text.muted} !important; opacity: 1; }
        .mobile-search-wrapper { position: relative; }
        .mobile-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: ${theme.text.muted}; width: 18px; height: 18px; pointer-events: none; }
      `}</style>

      <div className="d-none d-lg-block text-white border-bottom border-white border-opacity-10" style={{ backgroundColor: theme.dark, fontSize: '0.85rem' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-2">
            <a
              className="text-white text-decoration-none nav-link-minimal"
              href="https://www.comune.trento.it/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vai al sito del Comune di Trento (apre una nuova finestra)"
            >
              Comune di Trento
            </a>
            <UserMenu mobileMode={false} />
          </div>
        </div>
      </div>

      <div className="container py-2 py-lg-3">
        <div className="row align-items-center">
          <div className="col-8 col-lg-4 d-flex align-items-center gap-3">
             <button
              className="btn btn-link p-0 d-lg-none border-0 hamburger-btn"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="hamburger-lines" width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {isMenuOpen ? (
                   <>
                     <line x1="18" y1="6" x2="6" y2="18"></line>
                     <line x1="6" y1="6" x2="18" y2="18"></line>
                   </>
                ) : (
                   <>
                     <line x1="3" y1="12" x2="21" y2="12"></line>
                     <line x1="3" y1="6" x2="21" y2="6"></line>
                     <line x1="3" y1="18" x2="21" y2="18"></line>
                   </>
                )}
              </svg>
            </button>
            <Link href="/" className="d-flex align-items-center text-decoration-none text-white gap-2" aria-label="Trento Decide - Home">
              <svg className="icon" style={{ width: 32, height: 32, fill: "currentColor" }} aria-hidden="true"><use href="/svg/sprites.svg#it-pa"></use></svg>
              <span className="fw-semibold fs-4 lh-1">Trento Decide</span>
            </Link>
          </div>

          <div className="d-none d-lg-flex col-lg-8 justify-content-end">
            <SearchBox />
          </div>

          <div className="col-4 d-lg-none d-flex justify-content-end">
            <UserMenu mobileMode={true} />
          </div>
        </div>
      </div>

      <div className="d-none d-lg-block border-top border-white border-opacity-10">
        <div className="container">
          <nav className="d-flex align-items-center py-1 gap-4" aria-label="Navigazione principale">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-minimal ${isActive(link.href) ? "active" : ""} ${link.bold ? "fw-bold" : ""}`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div id="mobile-menu" className={`collapse ${isMenuOpen ? 'show' : ''} d-lg-none`}>
        <div className="bg-white shadow-lg p-3 border-top">
          <form onSubmit={handleMobileSearchSubmit} className="mb-3 mobile-search-wrapper" role="search">
            <svg className="mobile-search-icon" aria-hidden="true"><use href="/svg/sprites.svg#it-search"></use></svg>
            <input
              type="search"
              className="mobile-search-input"
              placeholder="Cerca..."
              value={mobileSearch}
              onChange={(e)=>setMobileSearch(e.target.value)}
              aria-label="Cerca nel sito"
            />
          </form>

          <h6 className="text-uppercase text-muted small fw-bold mt-3 mb-2 px-1">Navigazione</h6>
          <ul className="list-unstyled m-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="mb-1">
                <Link
                  href={link.href}
                  className={`d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${isActive(link.href) ? 'bg-light fw-bold text-success' : 'text-dark'} ${link.bold ? "fw-bold" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
