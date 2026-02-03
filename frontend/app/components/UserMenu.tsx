"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { getUserData, logout } from "@/lib/local"
import { theme } from "@/lib/theme"

interface UserMenuProps {
  mobileMode?: boolean
}

export default function UserMenu({ mobileMode = false }: UserMenuProps) {
  const [userName, setUserName] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const update = () => {
      const user = getUserData()
      if (user) {
        setUserName(user.username)
        setUserRole(user.role?.code ?? null)
      } else {
        setUserName(null)
        setUserRole(null)
      }

      setIsLoading(false)
    }

    update()

    window.addEventListener("authChange", update)
    return () => window.removeEventListener("authChange", update)
  }, [])

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
    setIsOpen(false)
    setUserName(null)
    router.refresh()
    router.push('/')
  }

  const isAdmin = userRole === 'admin'

  const profileLinks = [
    { href: "/profilo", hash: "#", label: "Dati personali", icon: "sprites.svg#it-user" },
    { href: "/profilo#mie-proposte", hash: "#mie-proposte", label: "Le mie proposte", icon: "sprites.svg#it-file" },
    { href: "/profilo#preferiti", hash: "#preferiti", label: "Preferiti", icon: "custom.svg#heart" },
    ...(isAdmin ? [{ href: "/dashboard", hash: "", label: "Dashboard", icon: "sprites.svg#it-settings", isAdmin: true }] : []),
  ]

  return (
    <div className="d-flex align-items-center position-relative" ref={menuRef}>
      <style jsx>{`
        .icon-transition {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .rotate-180 {
          transform: rotate(180deg);
        }

        @keyframes popupEnter {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .menu-animate {
          animation: popupEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }

        :global(.menu-item-green) {
          color: ${theme.text.dark} !important;
          background-color: transparent !important;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        :global(.dropdown-menu .menu-item-green:hover),
        :global(.dropdown-menu .menu-item-green:focus) {
          background-color: ${theme.hover.bgLight} !important;
          color: ${theme.primary} !important;
        }

        :global(.dropdown-menu .menu-item-green:hover svg),
        :global(.dropdown-menu .menu-item-green:focus svg) {
          fill: ${theme.primary} !important;
          color: ${theme.primary} !important;
        }

        :global(.logout-item) { background-color: #fff1f1; color: ${theme.hover.danger}; transition: all 0.2s ease; font-weight: 600; }
        :global(.logout-item:hover) { background-color: ${theme.hover.danger} !important; color: ${theme.text.light} !important; }
        :global(.logout-item:hover .logout-icon) { stroke: ${theme.text.light}; }

        :global(.hover-underline) {
          color: ${theme.text.light} !important;
          text-decoration: none !important;
          transition: text-decoration 0.2s;
        }
        :global(.hover-underline:hover span) {
          text-decoration: underline !important;
          text-underline-offset: 4px;
        }

        .user-btn-hover:hover .user-name-text {
          text-decoration: underline !important;
          text-underline-offset: 4px;
        }

        .skeleton-loader {
           background-color: rgba(255,255,255,0.2);
           height: 24px;
           width: 100px;
           border-radius: 4px;
           animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
           0% { opacity: 0.5; }
           50% { opacity: 0.8; }
           100% { opacity: 0.5; }
        }

        .force-align-menu {
          position: absolute !important; inset: auto !important; top: 100% !important; right: -10px !important; left: auto !important;
          margin-top: 0.5rem !important; display: block;
        }

        :global(.force-align-menu::before),
        :global(.force-align-menu::after) {
          left: auto !important;
          right: 13px !important;
        }

        @media (max-width: 991.98px) {
          .force-align-menu { position: static !important; width: 100% !important; animation: none !important; transform: none !important; }
          :global(.force-align-menu::before),
          :global(.force-align-menu::after) {
            display: none !important;
          }
        }
      `}</style>

      {isLoading ? (
        <div className="skeleton-loader" aria-hidden="true"></div>
      ) : userName ? (
        <div className="dropdown-wrapper">
          <button
            className="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center gap-1 p-0 border-0 user-btn-hover"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label="Menu utente"
          >
            <span className="d-block fw-bold user-name-text" style={{ fontSize: '0.95rem' }}>
              CIAO, {userName}
            </span>

            <svg
              className={`icon icon-sm ms-1 icon-transition ${isOpen ? 'rotate-180' : ''}`}
              style={{ width: 16, height: 16, fill: "currentColor", stroke: "currentColor", strokeWidth: 1 }}
              aria-hidden="true"
            >
              <use href="/svg/sprites.svg#it-expand"></use>
            </svg>
          </button>

          {isOpen && (
            <ul
              className="dropdown-menu show shadow border-0 mt-2 p-1 force-align-menu menu-animate"
              style={{ minWidth: "180px", zIndex: 9999, fontSize: '0.9rem', paddingTop: '8px', marginRight: '-18px !important' }}
            >
              {profileLinks.map((link, index) => {
                const isProfilePage = pathname === "/profilo"
                const finalHref = isProfilePage ? link.hash : link.href
                const commonProps = {
                  className: "dropdown-item menu-item-green d-flex align-items-center gap-2 py-1 px-2 rounded",
                  onClick: () => setIsOpen(false),
                }

                const content = (
                  <>
                    <svg className="icon icon-sm" style={{ width: 18, height: 18, fill: "currentColor" }} aria-hidden="true">
                      <use href={`/svg/${link.icon}`}></use>
                    </svg>
                    <span>{link.label}</span>
                  </>
                )

                return (
                  <li key={link.href} style={index === 0 ? { marginTop: '12px' } : {}}>
                    {isProfilePage ? (
                      <a href={finalHref} {...commonProps}>
                        {content}
                      </a>
                    ) : (
                      <Link href={finalHref} {...commonProps}>
                        {content}
                      </Link>
                    )}
                  </li>
                )
              })}
              <li><hr className="dropdown-divider my-1" style={{ borderTop: '1px solid #e0e0e0', opacity: 1 }} /></li>
              <li>
                <a
                  href="#"
                  className="dropdown-item logout-item d-flex align-items-center gap-2 py-1 px-2 rounded mt-1"
                  onClick={handleLogout}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Esci</span>
                </a>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <Link className="d-flex align-items-center gap-2 fw-bold hover-underline" href="/accedi">
          <svg className="icon" style={{ width: 22, height: 22, fill: "currentColor" }} aria-hidden="true"><use href="/svg/sprites.svg#it-user"></use></svg>
          {!mobileMode && <span>Accedi</span>}
        </Link>
      )}
    </div>
  )
}
