import Link from "next/link"

export default function Footer() {
  return (
    <footer className="it-footer trento-footer">
      <div className="it-footer-main">
        <div className="container">
          {/* BRAND */}
          <section className="mb-4">
            <div className="row">
              <div className="col-12 d-flex align-items-center">
                <div className="it-brand-wrapper">
                  <Link href="/" className="d-flex align-items-center text-decoration-none">
                    <svg className="icon me-2">
                      <use href="/svg/sprites.svg#it-pa"></use>
                    </svg>
                    <div className="it-brand-text">
                      <h2 className="no_toc mb-0">Trento Decide</h2>
                      <h3 className="no_toc small mb-0">Comune di Trento</h3>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* COLONNE PRINCIPALI (SINTETICHE) */}
          <section className="pb-4">
            <div className="row">
              {/* AMMINISTRAZIONE */}
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mb-lg-0">
                <h4 className="footer-heading-title">AMMINISTRAZIONE</h4>
                <div className="link-list-wrapper">
                  <ul className="link-list">
                    <li>
                      <a
                        href="https://www.comune.trento.it/Aree-tematiche/Istituzioni/Organi-istituzionali"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="list-item"
                      >
                        Organi di governo
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.comune.trento.it/Comune/Struttura-organizzativa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="list-item"
                      >
                        Struttura organizzativa
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.comune.trento.it/Comune/Documenti-e-dati"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="list-item"
                      >
                        Documenti e dati
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SERVIZI / PARTECIPAZIONE */}
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mb-lg-0">
                <h4 className="footer-heading-title">SERVIZI</h4>
                <div className="link-list-wrapper">
                  <ul className="link-list">
                    <li>
                      <Link href="/popolari" className="list-item">
                        Proposte popolari
                      </Link>
                    </li>
                    <li>
                      <Link href="/novita" className="list-item">
                        Novità
                      </Link>
                    </li>
                    <li>
                      <Link href="/proposte/nuova" className="list-item">
                        Crea una proposta
                      </Link>
                    </li>
                    <li>
                      <Link href="/regolamento" className="list-item">
                        Regolamento
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CONTATTI + LINK LEGALI */}
              <div className="col-lg-4 col-md-12 col-sm-12">
                <h4 className="footer-heading-title">CONTATTI</h4>
                <ul className="list-unstyled small mb-3">
                  <li>Comune di Trento</li>
                  <li>via Belenzani, 19 - 38122 Trento</li>
                  <li>Tel. +39 0461 884111</li>
                  <li>
                    <a href="mailto:comurp@comune.trento.it">comurp@comune.trento.it</a>
                  </li>
                  <li>
                    <a href="https://www.comune.trento.it/" target="_blank" rel="noopener noreferrer">
                      www.comune.trento.it
                    </a>
                  </li>
                </ul>

                <div className="link-list-wrapper">
                  <ul className="link-list small">
                    <li>
                      <Link href="/privacy" className="list-item">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link href="/note-legali" className="list-item">
                        Note legali
                      </Link>
                    </li>
                    <li>
                      <Link href="/accessibilita" className="list-item">
                        Dichiarazione di accessibilità
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* RIGA FINALE COOKIE / MAPPA SITO */}
          <section className="pt-3 mt-3 border-top border-light border-opacity-25">
            <div className="row">
              <div className="col-12 d-flex flex-column flex-md-row justify-content-between small">
                <div className="mb-2 mb-md-0">
                  <button type="button" className="btn btn-link p-0 footer-link-underline">
                    Personalizza i cookie
                  </button>
                  <span className="mx-3">·</span>
                  <Link href="/mappa-sito" className="footer-link-underline">
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