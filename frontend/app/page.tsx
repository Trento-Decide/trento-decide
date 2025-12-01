"use client"

import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("")

  const getMessage = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || "")
      const data = await response.text()

      setMessage(data)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <>
      {/* Header Section */}
      <header className="it-header-wrapper">
        <div className="it-header-slim-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="it-header-slim-wrapper-content">
                  <a className="d-none d-lg-block navbar-brand" href="#">Comune di Esempio</a>
                  <div className="nav-mobile">
                    <nav aria-label="Navigazione secondaria">
                      <a className="it-opener d-lg-none" data-bs-toggle="collapse" href="#menu-principale" role="button" aria-expanded="false" aria-controls="menu-principale">
                        <span>Menu</span>
                      </a>
                    </nav>
                  </div>
                  <div className="it-header-slim-right-zone">
                    <div className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                        <span>ITA</span>
                      </a>
                      <div className="dropdown-menu">
                        <div className="row">
                          <div className="col-12">
                            <div className="link-list-wrapper">
                              <ul className="link-list">
                                <li><a className="list-item" href="#"><span>ITA</span></a></li>
                                <li><a className="list-item" href="#"><span>ENG</span></a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="it-access-top-wrapper">
                      <button className="btn btn-primary btn-sm" type="button">Accedi</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="it-header-center-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="it-header-center-content-wrapper">
                  <div className="it-brand-wrapper">
                    <a href="#">
                      <div className="it-brand-text">
                        <div className="it-brand-title">Nome del Comune</div>
                        <div className="it-brand-tagline">Uno slogan efficace</div>
                      </div>
                    </a>
                  </div>
                  <div className="it-right-zone">
                    <div className="it-socials d-none d-md-flex">
                      <span>Seguici su</span>
                      <ul>
                        <li><a href="#" aria-label="Facebook" target="_blank">FB</a></li>
                        <li><a href="#" aria-label="Twitter" target="_blank">TW</a></li>
                      </ul>
                    </div>
                    <div className="it-search-wrapper">
                      <span className="d-none d-md-block">Cerca</span>
                      <a className="search-link rounded-icon" href="#" aria-label="Cerca">
                        <span>🔍</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="it-header-navbar-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <nav className="navbar navbar-expand-lg has-megamenu">
                  <button className="custom-navbar-toggler" type="button" aria-controls="nav10" aria-expanded="false" aria-label="Toggle navigation" data-bs-toggle="navbarcollapsible" data-bs-target="#nav10">
                    <span>☰</span>
                  </button>
                  <div className="navbar-collapsable" id="nav10">
                    <div className="overlay"></div>
                    <div className="close-div">
                      <button className="btn close-menu" type="button"><span className="it-close"></span>close</button>
                    </div>
                    <div className="menu-wrapper">
                      <ul className="navbar-nav">
                        <li className="nav-item active"><a className="nav-link" href="#"><span>Amministrazione</span> <span className="visually-hidden">(attivo)</span></a></li>
                        <li className="nav-item"><a className="nav-link" href="#"><span>Novità</span></a></li>
                        <li className="nav-item"><a className="nav-link" href="#"><span>Servizi</span></a></li>
                        <li className="nav-item"><a className="nav-link" href="#"><span>Documenti</span></a></li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="it-hero-wrapper it-dark it-overlay">
        <div className="img-responsive-wrapper">
          <div className="img-wrapper">
            <img src="https://picsum.photos/1200/400" title="img title" alt="imagealt" />
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-hero-text-wrapper bg-dark-translucent">
                <span className="it-category">Novità</span>
                <h1 className="no_toc">Benvenuti nel nuovo portale</h1>
                <p className="d-none d-lg-block">Scopri i servizi digitali del comune, le ultime notizie e gli eventi in programma.</p>
                <div className="it-btn-container">
                  <a className="btn btn-sm btn-secondary" href="#">Scopri di più</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container my-5">
        <div className="row">
          <div className="col-12 col-lg-8">
            <h2>Ultime Notizie</h2>
            {/* News Cards */}
            <div className="row">
              {[1, 2, 3].map((item) => (
                <div className="col-12 col-md-6 mb-4" key={item}>
                  <div className="card-wrapper card-space">
                    <div className="card card-bg">
                      <div className="card-body">
                        <div className="category-top">
                          <a className="category" href="#">Categoria</a>
                          <span className="data">25/11/2025</span>
                        </div>
                        <h5 className="card-title big-heading">Titolo della notizia {item}</h5>
                        <p className="card-text">Breve descrizione della notizia che spiega di cosa si tratta in poche righe.</p>
                        <a className="read-more" href="#">
                          <span className="text">Leggi tutto</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            {/* Sidebar / Services */}
            <h3>Servizi in evidenza</h3>
            <div className="link-list-wrapper">
              <ul className="link-list">
                <li><a className="list-item" href="#"><span>Anagrafe Online</span></a></li>
                <li><a className="list-item" href="#"><span>Pagamenti PagoPA</span></a></li>
                <li><a className="list-item" href="#"><span>Prenotazione Appuntamenti</span></a></li>
                <li><a className="list-item" href="#"><span>Segnalazioni</span></a></li>
              </ul>
            </div>

            {/* DB Test Section */}
            <div className="mt-5 p-4 bg-light border rounded">
              <h4>Area Sviluppo</h4>
              <p>Test connessione backend:</p>
              <button type="button" className="btn btn-primary" onClick={getMessage}>
                Get Message from Backend
              </button>

              {message && (
                <div className="alert alert-info mt-4" role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="it-footer">
        <div className="it-footer-main">
          <div className="container">
            <section>
              <div className="row clearfix">
                <div className="col-sm-12">
                  <div className="it-brand-wrapper">
                    <a href="#">
                      <div className="it-brand-text">
                        <h2 className="no_toc">Nome del Comune</h2>
                        <h3 className="no_toc d-none d-md-block">Uno slogan efficace</h3>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 pb-2">
                  <h4>Amministrazione</h4>
                  <div className="link-list-wrapper">
                    <ul className="footer-list link-list clearfix">
                      <li><a className="list-item" href="#" title="Vai alla pagina: Organi di governo">Organi di governo</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: Aree amministrative">Aree amministrative</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: Uffici">Uffici</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 pb-2">
                  <h4>Servizi</h4>
                  <div className="link-list-wrapper">
                    <ul className="footer-list link-list clearfix">
                      <li><a className="list-item" href="#" title="Vai alla pagina: Pagamenti">Pagamenti</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: Sostegno">Sostegno</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: Domande e iscrizioni">Domande e iscrizioni</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 pb-2">
                  <h4>Novità</h4>
                  <div className="link-list-wrapper">
                    <ul className="footer-list link-list clearfix">
                      <li><a className="list-item" href="#" title="Vai alla pagina: Notizie">Notizie</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: Eventi">Eventi</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: Comunicati stampa">Comunicati stampa</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 pb-2">
                  <h4>Contatti</h4>
                  <div className="link-list-wrapper">
                    <ul className="footer-list link-list clearfix">
                      <li><a className="list-item" href="#" title="Vai alla pagina: Contatti">Contatti</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: FAQ">FAQ</a></li>
                      <li><a className="list-item" href="#" title="Vai alla pagina: Privacy Policy">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="it-footer-small-prints clearfix">
          <div className="container">
            <h3 className="visually-hidden">Sezione Link Utili</h3>
            <ul className="it-footer-small-prints-list list-inline mb-0 d-flex flex-column flex-md-row">
              <li className="list-inline-item"><a href="#" title="Note Legali">Media policy</a></li>
              <li className="list-inline-item"><a href="#" title="Note Legali">Note legali</a></li>
              <li className="list-inline-item"><a href="#" title="Privacy-Cookies">Privacy policy</a></li>
              <li className="list-inline-item"><a href="#" title="Mappa del sito">Mappa del sito</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
