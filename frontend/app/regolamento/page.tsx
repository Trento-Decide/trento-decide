"use client"

import Link from "next/link"
import { theme } from "@/lib/theme"

export default function RegulationPage() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="display-5 fw-bold mb-3" style={{ color: theme.primary }}>
          Regolamento della Piattaforma
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          Per garantire uno spazio di dialogo costruttivo e democratico, chiediamo a tutti i cittadini di rispettare queste semplici linee guida.
        </p>
        <p className="small text-muted mt-3">
          <svg className="icon icon-xs me-1"><use href="/svg/sprites.svg#it-calendar"></use></svg>
          Ultimo aggiornamento: <span className="fw-semibold text-dark">29 Dicembre 2025</span>
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          
          <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 bg-white">
            <section className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-user"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Chi può partecipare</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Requisiti di accesso</span>
                </div>
              </div>
              <p className="text-muted mb-4">
                La partecipazione è aperta a tutti i cittadini residenti nel comune. Per inserire proposte o votare è necessaria la registrazione tramite SPID/CIE, che verifica l&apos;identità dell&apos;utente per garantire il principio &quot;una testa, un voto&quot;.
              </p>
              
              <div className="bg-light rounded-3 p-4 border border-light">
                <div className="row g-3">
                    <div className="col-md-4 d-flex align-items-center">
                        <svg className="icon icon-sm text-primary me-2"><use href="/svg/sprites.svg#it-check-circle"></use></svg>
                        <span className="fw-medium">Età minima: <strong>16 anni</strong></span>
                    </div>
                    <div className="col-md-4 d-flex align-items-center">
                        <svg className="icon icon-sm text-primary me-2"><use href="/svg/sprites.svg#it-check-circle"></use></svg>
                        <span className="fw-medium">Obbligo di residenza</span>
                    </div>
                    <div className="col-md-4 d-flex align-items-center">
                        <svg className="icon icon-sm text-primary me-2"><use href="/svg/sprites.svg#it-check-circle"></use></svg>
                        <span className="fw-medium">Un solo account a persona</span>
                    </div>
                </div>
              </div>
            </section>

            <hr className="my-5 border-light" />
            <section className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(25, 135, 84, 0.1)', color: '#198754' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-file"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Linee guida per le Proposte</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Criteri di moderazione</span>
                </div>
              </div>
              <p className="text-muted mb-4">
                Ogni cittadino può avanzare proposte per migliorare la città. Affinché vengano approvate dai moderatori e pubblicate, le proposte devono rispettare i seguenti criteri:
              </p>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="h-100 p-4 rounded-3 border" style={{ backgroundColor: '#f8fff9', borderColor: '#d1e7dd' }}>
                    <div className="d-flex align-items-center mb-3 text-success">
                        <svg className="icon icon-sm me-2"><use href="/svg/sprites.svg#it-check-circle"></use></svg>
                        <h5 className="h6 fw-bold mb-0 text-uppercase ls-1">Cosa accettiamo</h5>
                    </div>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2 text-muted small">
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-success">•</span> Idee di interesse collettivo (es. parchi, viabilità).
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-success">•</span> Proposte chiare con titolo e descrizione esaustivi.
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-success">•</span> Progetti tecnicamente fattibili a livello comunale.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-4 rounded-3 border" style={{ backgroundColor: '#fff8f8', borderColor: '#f5c6cb' }}>
                    <div className="d-flex align-items-center mb-3 text-danger">
                        <svg className="icon icon-sm me-2"><use href="/svg/sprites.svg#it-error"></use></svg>
                        <h5 className="h6 fw-bold mb-0 text-uppercase ls-1">Cosa rifiutiamo</h5>
                    </div>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2 text-muted small">
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-danger">•</span> Interessi puramente privati o commerciali.
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-danger">•</span> Linguaggio offensivo, discriminatorio o d&apos;odio.
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-danger">•</span> Proposte duplicate (controlla con la ricerca).
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-danger">•</span> Questioni di competenza nazionale.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <hr className="my-5 border-light" />
            <section className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(13, 202, 240, 0.1)', color: '#0dcaf0' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-chart-line"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Sondaggi Istituzionali</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Consultazioni ufficiali</span>
                </div>
              </div>
              <p className="text-muted">
                I sondaggi presenti nella sezione dedicata sono creati direttamente dall&apos;Amministrazione per consultare i cittadini su temi specifici. A differenza delle proposte, i sondaggi hanno una durata temporale limitata.
              </p>
              <div className="d-flex gap-2 align-items-center mt-3 text-info small bg-info bg-opacity-10 p-3 rounded-3">
                 <svg className="icon icon-xs flex-shrink-0"><use href="/svg/sprites.svg#it-info-circle"></use></svg>
                 <span>Una volta scaduti, i risultati vengono analizzati dagli uffici competenti e pubblicati come report ufficiale accessibile a tutti.</span>
              </div>
            </section>

            <hr className="my-5 border-light" />
            <section>
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#fd7e14' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-ban"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Moderazione e Sanzioni</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Sicurezza della community</span>
                </div>
              </div>
              <p className="text-muted mb-4">
                La piattaforma è moderata attivamente. Ci riserviamo il diritto di rimuovere contenuti o sospendere account che violano ripetutamente queste regole per preservare un clima civile.
              </p>
              
              <div className="alert alert-warning border-warning bg-warning bg-opacity-10 rounded-3 border-0 d-flex align-items-start" role="alert">
                <div className="small text-dark">
                  <strong>Segnalazioni:</strong> Hai notato un contenuto inappropriato? Puoi segnalarlo cliccando sui tre puntini accanto al contenuto e inserendo una motivazione. Il nostro team esaminerà la segnalazione entro 24 ore.
                </div>
              </div>
            </section>

          </div>
          <div className="text-center mt-5">
            <p className="mb-3 text-muted">Hai letto tutto e sei pronto a contribuire alla tua città?</p>
            <Link href="/proposte/nuova" className="btn btn-primary btn-lg rounded-3 px-5 py-3 fw-bold shadow-sm transition-all hover-lift">
              <div className="d-flex align-items-center gap-2">
                 Inizia subito
              </div>
            </Link>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        .ls-1 { letter-spacing: 0.5px; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  )
}