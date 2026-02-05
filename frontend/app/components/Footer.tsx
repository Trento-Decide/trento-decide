"use client"

import Link from "next/link"
import { theme } from "@/lib/theme"

const ADMINISTRATION_LINKS = [
  { label: "Comune di Trento", href: "https://www.comune.trento.it/" },
  { label: "Organi di governo", href: "https://www.comune.trento.it/Aree-tematiche/Istituzioni/Organi-istituzionali" },
  { label: "Documenti e dati", href: "https://www.comune.trento.it/Comune/Documenti-e-dati" },
  { label: "Albo Pretorio", href: "https://www.comune.trento.it/Comune/Albo-pretorio" },
]

const PLATFORM_LINKS = [
  { label: "Esplora Proposte", href: "/proposte" },
  { label: "Partecipa ai Sondaggi", href: "/sondaggi" },
  { label: "Come funziona", href: "/guida" },
]

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Note Legali", href: "/note-legali" },
  { label: "Accessibilità", href: "/accessibilita" },
  { label: "Impostazioni Cookie", href: "#", isButton: true },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-dark text-white pt-5 pb-4" style={{ backgroundColor: '#17191c', borderTop: `4px solid ${theme.primary}` }}>
      <div className="container">

        <div className="row mb-5">
          <div className="col-12">
            <Link href="/" className="d-inline-flex align-items-center text-decoration-none text-white gap-3 group-hover">
              <div className="bg-white p-2 rounded-2 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                <svg className="icon icon-lg" style={{ fill: '#17191c' }}>
                  <use href="/svg/sprites.svg#it-pa"></use>
                </svg>
              </div>
              <div className="d-flex flex-column">
                <span className="h4 fw-bold mb-0 lh-1">Trento Decide</span>
                <span className="small text-white-50 text-uppercase ls-1">Piattaforma di Partecipazione Civica</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="row g-4 mb-5">

          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase fw-bold text-white-50 mb-3 ls-1">Contatti</h6>
            <ul className="list-unstyled text-light small mb-4" style={{ lineHeight: '1.8' }}>
              <li className="fw-bold mb-1">Comune di Trento</li>
              <li>via Belenzani, 19</li>
              <li>38122 Trento (TN)</li>
              <li className="mt-2">Tel: <a href="tel:+390461884111" className="footer-link">+39 0461 884111</a></li>
              <li>PEC: <a href="mailto:comune.trento@cert.legalmail.it" className="footer-link">comune.trento@cert.legalmail.it</a></li>
            </ul>

            <div className="d-flex gap-3">
              {[
                { icon: 'it-facebook', href: 'https://facebook.com' },
                { icon: 'it-twitter', href: 'https://twitter.com' },
                { icon: 'it-instagram', href: 'https://instagram.com' },
                { icon: 'it-youtube', href: 'https://youtube.com' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn d-flex align-items-center justify-content-center rounded-circle border border-secondary"
                  style={{ width: 36, height: 36, color: "white", textDecoration: 'none' }}
                >
                  <svg className="icon icon-sm" style={{ fill: 'currentColor' }}><use href={`/svg/sprites.svg#${social.icon}`}></use></svg>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-white-50 mb-3 ls-1">Amministrazione</h6>
            <ul className="list-unstyled">
              {ADMINISTRATION_LINKS.map((link, i) => (
                <li key={i} className="mb-2">
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link small">
                    {link.label}
                    <svg className="icon icon-xs ms-1 opacity-50" style={{ fill: 'currentColor', width: 10, height: 10 }}><use href="/svg/sprites.svg#it-external-link"></use></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-white-50 mb-3 ls-1">Piattaforma</h6>
            <ul className="list-unstyled">
              {PLATFORM_LINKS.map((link, i) => (
                <li key={i} className="mb-2">
                  <Link href={link.href} className="footer-link small">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <div className="p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
              <span className="d-block fw-bold small text-white mb-2">Serve aiuto?</span>
              <p className="x-small text-white-50 mb-3">
                Scrivi all&apos;URP per assistenza tecnica o amministrativa.
              </p>
              <a href="mailto:comurp@comune.trento.it" className="btn btn-sm btn-outline-light w-100 x-small">
                Scrivi mail
              </a>
            </div>
          </div>

        </div>

        <div className="border-top border-secondary border-opacity-25 pt-4">
          <div className="row align-items-center gy-3">

            <div className="col-md-6 text-center text-md-start">
              <ul className="list-inline mb-0 small">
                {LEGAL_LINKS.map((link, i) => (
                  <li key={i} className="list-inline-item me-3">
                    {link.isButton ? (
                      <button className="btn btn-link p-0 text-white-50 text-decoration-none footer-link x-small" style={{ fontSize: '0.85rem' }}>
                        {link.label}
                      </button>
                    ) : (
                      <Link href={link.href} className="text-white-50 text-decoration-none footer-link x-small" style={{ fontSize: '0.85rem' }}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-6 text-center text-md-end">
              <span className="text-white-50 x-small" style={{ fontSize: '0.85rem' }}>
                &copy; {currentYear} Comune di Trento - P.IVA 00123900228
              </span>
            </div>

          </div>
        </div>

      </div>

      <style jsx>{`
        .ls-1 { letter-spacing: 1px; }
        .x-small { font-size: 0.85rem; }
        
        .footer-link {
          color: #adb5bd;
          text-decoration: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        
        .footer-link:hover {
          color: #fff;
          text-decoration: underline;
        }

        .social-btn {
            background-color: transparent;
            transition: all 0.2s ease;
        }
        .social-btn:hover {
            background-color: ${theme.primary};
            border-color: ${theme.primary} !important;
            transform: translateY(-3px);
        }
      `}</style>
    </footer>
  )
}