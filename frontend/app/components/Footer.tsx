import Link from "next/link"
import { theme } from "@/lib/theme"

const ADMINISTRATION_LINKS = [
  { label: "Organi di governo", href: "https://www.comune.trento.it/Aree-tematiche/Istituzioni/Organi-istituzionali" },
  { label: "Struttura organizzativa", href: "https://www.comune.trento.it/Comune/Struttura-organizzativa" },
  { label: "Documenti e dati", href: "https://www.comune.trento.it/Comune/Documenti-e-dati" },
]

const SERVICE_LINKS = [
  { label: "Proposte popolari", href: "/popolari" },
  { label: "Novità", href: "/novita" },
  { label: "Crea una proposta", href: "/proposte/nuova" },
  { label: "Regolamento", href: "/regolamento" },
]

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Note legali", href: "/note-legali" },
  { label: "Dichiarazione di accessibilità", href: "/accessibilita" },
]

export default function Footer() {
  const linkStyle = { color: theme.text.footerText, textDecoration: "none" }
  const headingStyle = {
    fontSize: "0.9rem",
    letterSpacing: "0.08em",
    fontWeight: 600,
    color: theme.text.light,
  }

  return (
    <footer className="it-footer" style={{ backgroundColor: theme.footer, color: theme.text.footerText }}>
      <div className="it-footer-main" style={{ backgroundColor: "transparent" }}>
        <div className="container">
          
          <section className="mb-4">
            <div className="row">
              <div className="col-12 d-flex align-items-center">
                <div className="it-brand-wrapper">
                  <Link href="/" className="d-flex align-items-center text-decoration-none" style={linkStyle}>
                    <svg className="icon me-2" style={{ color: theme.text.light, fill: "currentColor" }}>
                      <use href="/svg/sprites.svg#it-pa"></use>
                    </svg>
                    <div className="it-brand-text">
                      <h2 className="no_toc mb-0" style={{ color: theme.text.footerMuted }}>Trento Decide</h2>
                      <h3 className="no_toc small mb-0" style={{ color: theme.text.footerMuted }}>Comune di Trento</h3>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-4">
            <div className="row">
              
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mb-lg-0">
                <h4 className="text-uppercase mb-3" style={headingStyle}>AMMINISTRAZIONE</h4>
                <div className="link-list-wrapper">
                  <ul className="link-list">
                    {ADMINISTRATION_LINKS.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="list-item ps-0"
                          style={linkStyle}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mb-lg-0">
                <h4 className="text-uppercase mb-3" style={headingStyle}>SERVIZI</h4>
                <div className="link-list-wrapper">
                  <ul className="link-list">
                    {SERVICE_LINKS.map((link, i) => (
                      <li key={i}>
                        <Link href={link.href} className="list-item ps-0" style={linkStyle}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12">
                <h4 className="text-uppercase mb-3" style={headingStyle}>CONTATTI</h4>
                
                <ul className="list-unstyled small mb-3" style={{ color: theme.text.footerMuted }}>
                  <li>Comune di Trento</li>
                  <li>via Belenzani, 19 - 38122 Trento</li>
                  <li>Tel. +39 0461 884111</li>
                  <li>
                    <a href="mailto:comurp@comune.trento.it" style={linkStyle}>comurp@comune.trento.it</a>
                  </li>
                  <li>
                    <a href="https://www.comune.trento.it/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                      www.comune.trento.it
                    </a>
                  </li>
                </ul>

                <div className="link-list-wrapper">
                  <ul className="link-list small">
                    {LEGAL_LINKS.map((link, i) => (
                      <li key={i}>
                        <Link href={link.href} className="list-item ps-0" style={linkStyle}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </section>

          <section className="pt-3 mt-3 border-top border-light border-opacity-25">
            <div className="row">
              <div className="col-12 d-flex flex-column flex-md-row justify-content-between small" style={{ color: theme.text.footerMuted }}>
                <div className="mb-2 mb-md-0">
                  <button type="button" className="btn btn-link p-0 text-decoration-underline" style={linkStyle}>
                    Personalizza i cookie
                  </button>
                  <span className="mx-3">·</span>
                  <Link href="/mappa-sito" className="text-decoration-underline" style={linkStyle}>
                    Mappa sito
                  </Link>
                </div>
                <div className="text-md-end">
                  &copy; {new Date().getFullYear()} Comune di Trento – Trento Decide
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </footer>
  )
}