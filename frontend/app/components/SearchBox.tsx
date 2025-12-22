"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { theme } from "@/lib/theme"

type InitialState = {
  q: string
  titlesOnly: boolean
  author: string
}

export default function SearchBox() {
  const searchParams = useSearchParams()
  const initial: InitialState = {
    q: searchParams?.get("q") ?? "",
    titlesOnly: searchParams?.get("titlesOnly") === "true",
    author: searchParams?.get("author") ?? "",
  }

  return <SearchBoxInner key={searchParams?.toString() ?? ""} initial={initial} />
}

function SearchBoxInner({ initial }: { initial: InitialState }) {
  const router = useRouter()
  const searchContainerRef = useRef<HTMLFormElement>(null)

  const [search, setSearch] = useState(initial.q)
  const [searchTitlesOnly, setSearchTitlesOnly] = useState(initial.titlesOnly)
  const [searchMember, setSearchMember] = useState(initial.author)
  const [showSearchPopup, setShowSearchPopup] = useState(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchPopup(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    const qTrimmed = search.trim()
    if (qTrimmed) params.set('q', qTrimmed)
    if (searchTitlesOnly) params.set('titlesOnly', 'true')
    const memberTrimmed = searchMember.trim()
    if (memberTrimmed) params.set('author', memberTrimmed)

    if (!qTrimmed && !memberTrimmed) return

    router.push(`/cerca?${params.toString()}`)
    setShowSearchPopup(false)
  }

  const clearSearch = () => {
    setSearch("")
    setSearchMember("")
    setSearchTitlesOnly(false)
  }

  return (
    <div className="search-wrapper-placeholder">
      <style jsx>{`
        .search-wrapper-placeholder {
          position: relative; width: 100%; max-width: 280px; height: 40px; z-index: 2000;
        }
        .search-container-card {
          position: absolute; top: 0; left: 0; width: 100%;
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          transition: all 0.2s ease;
          overflow: hidden;
        }
        .search-container-card.active {
          background-color: #ffffff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          overflow: visible; color: ${theme.text.dark};
        }
        .search-input-area { position: relative; height: 40px; display: flex; align-items: center; }
        .search-input-custom {
          width: 100%; height: 100%; border: 0 !important; border-radius: 8px;
          box-shadow: none !important; outline: none !important;
          padding-left: 44px !important; padding-right: 35px !important;
          font-size: 0.95rem; background-color: transparent !important;
          color: ${theme.text.light} !important; transition: color 0.2s ease;
        }
        .search-input-custom::placeholder { color: rgba(255, 255, 255, 0.8) !important; }
        .search-container-card.active .search-input-custom { color: ${theme.text.dark} !important; }
        .search-container-card.active .search-input-custom::placeholder { color: #999999 !important; }
        .search-icon-left {
          position: absolute; left: 14px; color: ${theme.text.light} !important; fill: ${theme.text.light} !important;
          opacity: 0.9; pointer-events: none; transition: all 0.2s ease;
        }
        .search-container-card.active .search-icon-left { color: #555555 !important; fill: #555555 !important; }
        .search-clear-btn {
          position: absolute; right: 8px; background: none; border: none; padding: 6px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: rgba(255, 255, 255, 0.7);
        }
        .search-clear-btn:hover { color: white; }
        .search-container-card.active .search-clear-btn { color: #999999; }
        .search-container-card.active .search-clear-btn:hover { color: ${theme.text.dark}; }
        .advanced-search-options {
          max-height: 0; opacity: 0; overflow: hidden; transition: all 0.25s ease;
          border-top: 1px solid transparent;
        }
        .search-container-card.active .advanced-search-options {
          max-height: 300px; opacity: 1; padding: 0 16px 16px 16px; border-top: 1px solid #f0f0f0;
        }
        input[type="search"]::-webkit-search-cancel-button { display: none !important; }
        :global(.advanced-search-link) {
          text-decoration: none !important;
          color: ${theme.primary} !important;
          transition: all 0.2s ease;
        }
        :global(.advanced-search-link:hover) {
          text-decoration: underline !important;
          color: ${theme.dark} !important;
        }
      `}</style>

      <form
        onSubmit={handleSearchSubmit}
        className={`search-container-card ${showSearchPopup ? "active" : ""}`}
        onFocus={() => setShowSearchPopup(true)}
        ref={searchContainerRef}
        role="search"
      >
        <div className="search-input-area">
          <svg className="icon search-icon-left" style={{ width: 18, height: 18 }} aria-hidden="true">
            <use href="/svg/sprites.svg#it-search"></use>
          </svg>
          <input
            type="search"
            className="search-input-custom"
            placeholder="Cerca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            aria-label="Cerca nel sito"
            onFocus={() => setShowSearchPopup(true)}
          />
          {search && (
            <button type="button" className="search-clear-btn" onClick={clearSearch} aria-label="Cancella ricerca">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="advanced-search-options" aria-hidden={!showSearchPopup}>
          <div className="form-check mb-2 mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="sb-titlesOnly"
              checked={searchTitlesOnly}
              onChange={(e) => setSearchTitlesOnly(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label className="form-check-label text-muted small" htmlFor="sb-titlesOnly" style={{ paddingTop: 2, cursor: "pointer", color: "#555" }}>
              Cerca solo nei titoli
            </label>
          </div>

          <div className="mb-3">
            <label htmlFor="sb-searchMember" className="form-label small text-muted mb-1">
              Di: Utente
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="sb-searchMember"
              placeholder="Nome utente..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              style={{ backgroundColor: "#f9f9f9" }}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
            <Link href="/ricerca-avanzata" className="small advanced-search-link" onClick={() => setShowSearchPopup(false)}>
              Ricerca avanzata...
            </Link>
            <button type="submit" className="btn btn-sm text-white px-3" style={{ backgroundColor: theme.primary, borderRadius: "4px" }}>
              Cerca
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}