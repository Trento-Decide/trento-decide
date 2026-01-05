"use client"

import Link from "next/link"
import { theme } from "@/lib/theme"

export default function GuidePage() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="display-5 fw-bold mb-3" style={{ color: theme.primary }}>
          Come funziona Trento Decide?
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          Una guida semplice per trasformare le tue idee in azioni concrete per la città.
          Scopri come creare proposte, partecipare ai sondaggi e sostenere le iniziative.
        </p>
      </div>

      <div className="row g-5">
        <div className="col-lg-3 d-none d-lg-block">
          <div className="sticky-top" style={{ top: "2rem", zIndex: 1 }}>
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
              <div className="list-group list-group-flush">
                <a href="#account" className="list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold d-flex align-items-center">
                  <span className="badge bg-primary bg-opacity-10 text-primary me-3 rounded-3">1</span> Account
                </a>
                <a href="#proposte" className="list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold d-flex align-items-center">
                  <span className="badge bg-success bg-opacity-10 text-success me-3 rounded-3">2</span> Proposte
                </a>
                <a href="#voti" className="list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold d-flex align-items-center">
                  <span className="badge bg-warning bg-opacity-10 text-warning me-3 rounded-3">3</span> Voti
                </a>
                <a href="#sondaggi" className="list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold d-flex align-items-center">
                  <span className="badge bg-info bg-opacity-10 text-info me-3 rounded-3">4</span> Sondaggi
                </a>
                <a href="#moderazione" className="list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold d-flex align-items-center">
                  <span className="badge bg-danger bg-opacity-10 text-danger me-3 rounded-3">5</span> Regole
                </a>
              </div>
            </div>
            
            <div className="p-4 bg-light rounded-3 border border-light text-center">
              <p className="small mb-3 text-muted">Hai riscontrato un problema tecnico?</p>
              <Link href="mailto:supporto@comune.test" className="btn btn-outline-dark btn-sm rounded-3 px-4">
                Contatta il supporto
              </Link>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          
          <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 bg-white">
            <section id="account" className="mb-5 scroll-margin-top">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-user"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Account e Profilo</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Chi può fare cosa</span>
                </div>
              </div>
              
              <div className="p-4 rounded-3 border bg-light">
                <p className="mb-3 text-muted">
                  Per garantire la qualità e la veridicità delle interazioni, molte funzioni della piattaforma richiedono la registrazione.
                </p>
                <ul className="list-unstyled mb-4 d-flex flex-column gap-2">
                  <li className="d-flex align-items-start gap-2">
                    <svg className="icon icon-sm text-secondary mt-1 flex-shrink-0"><use href="/svg/sprites.svg#it-user"></use></svg>
                    <span><strong>Ospite (Non registrato):</strong> Può navigare tra le proposte pubbliche, leggere i dettagli e visualizzare i risultati.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <svg className="icon icon-sm text-primary mt-1 flex-shrink-0"><use href="/svg/sprites.svg#it-check-circle"></use></svg>
                    <span><strong>Cittadino Registrato:</strong> Può creare nuove proposte, votare (endorsement), aggiungere preferiti e partecipare ai sondaggi.</span>
                  </li>
                </ul>
                <Link href="/registrati" className="btn btn-primary btn-sm rounded-3 px-4 fw-bold">
                  Registrati ora
                </Link>
              </div>
            </section>

            <hr className="my-5 border-light" />
            <section id="proposte" className="mb-5 scroll-margin-top">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(25, 135, 84, 0.1)', color: '#198754' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-pencil"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Creare una Proposta</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Il ciclo di vita</span>
                </div>
              </div>
              
              <p className="mb-4 text-muted">
                Hai un&apos;idea per migliorare il quartiere? Puoi inviarla all&apos;amministrazione. Ogni proposta segue un percorso trasparente:
              </p>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="h-100 p-3 rounded-3 border bg-light d-flex gap-3 align-items-start">
                    <span className="badge bg-secondary rounded-3">1</span>
                    <div>
                      <h6 className="fw-bold mb-1 text-secondary">Bozza</h6>
                      <p className="small text-muted mb-0">Visibile solo a te. Puoi salvarla e modificarla quante volte vuoi.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-3 rounded-3 border d-flex gap-3 align-items-start" style={{ backgroundColor: '#f0f7ff', borderColor: '#cce5ff' }}>
                    <span className="badge bg-primary rounded-3">2</span>
                    <div>
                      <h6 className="fw-bold mb-1 text-primary">Pubblicata</h6>
                      <p className="small text-muted mb-0">Visibile a tutti. I cittadini possono votarla e commentarla.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-3 rounded-3 border d-flex gap-3 align-items-start" style={{ backgroundColor: '#fff9e6', borderColor: '#ffeeba' }}>
                    <span className="badge bg-warning rounded-3">3</span>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">In Valutazione</h6>
                      <p className="small text-muted mb-0">Se raggiunge abbastanza voti, l&apos;amministrazione ne studia la fattibilità.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-3 rounded-3 border d-flex gap-3 align-items-start" style={{ backgroundColor: '#f0fff4', borderColor: '#d3f9d8' }}>
                    <span className="badge bg-success rounded-3">4</span>
                    <div>
                      <h6 className="fw-bold mb-1 text-success">Approvata</h6>
                      <p className="small text-muted mb-0">La proposta è stata accettata e inserita nel piano lavori.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-3 border border-info bg-info bg-opacity-10 d-flex gap-3 align-items-center">
                 <svg className="icon icon-sm text-info flex-shrink-0"><use href="/svg/sprites.svg#it-info-circle"></use></svg>
                 <span className="small text-dark"><strong>Suggerimento:</strong> Compila campi come Budget e Area geografica per aumentare le probabilità di successo.</span>
              </div>
            </section>

            <hr className="my-5 border-light" />
            <section id="voti" className="mb-5 scroll-margin-top">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#e0ad16' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-star-full"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Voti e Sostegno</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Esprimi la tua opinione</span>
                </div>
              </div>
              
              <div className="p-4 rounded-3 border">
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="d-flex flex-column align-items-center p-2 rounded bg-light border" style={{ minWidth: 60 }}>
                    <svg className="icon icon-primary mb-1" style={{width:24, height:24, fill: theme.primary}}><use href="/svg/sprites.svg#it-arrow-up-circle"></use></svg>
                    <span className="fw-bold small text-dark">120</span>
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark fs-6">Voto Positivo (+1)</h5>
                    <p className="mb-0 text-muted small">
                      Usa questo tasto se ritieni che la proposta sia utile per la città. Più voti positivi riceve una proposta, più salirà in classifica.
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-start gap-3">
                  <div className="d-flex flex-column align-items-center p-2 rounded bg-light border" style={{ minWidth: 60 }}>
                    <svg className="icon icon-danger mb-1" style={{width:24, height:24, fill: '#dc3545'}}><use href="/svg/sprites.svg#it-arrow-down-circle"></use></svg>
                    <span className="fw-bold small text-dark">-5</span>
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark fs-6">Voto Negativo (-1)</h5>
                    <p className="mb-0 text-muted small">
                      Usa questo tasto se pensi che la proposta non sia prioritaria, sia formulata male o sia dannosa per la collettività.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="my-5 border-light" />
            <section id="sondaggi" className="mb-5 scroll-margin-top">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(13, 202, 240, 0.1)', color: '#0dcaf0' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-chart-line"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Partecipare ai Sondaggi</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Consultazioni</span>
                </div>
              </div>
              
              <p className="text-muted mb-4">
                I sondaggi sono creati dall&apos;Amministrazione su temi caldi. Ecco come funzionano:
              </p>

              <div className="row g-3">
                <div className="col-md-6">
                    <div className="p-3 border rounded-3 h-100 d-flex flex-column">
                        <span className="badge bg-success bg-opacity-10 text-success align-self-start mb-2">Attivi</span>
                        <p className="small text-muted mb-0">Puoi votare una sola volta. Il voto è anonimo a fini statistici, ma registrato per evitare duplicati.</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-3 border rounded-3 h-100 d-flex flex-column">
                        <span className="badge bg-secondary bg-opacity-10 text-secondary align-self-start mb-2">Chiusi</span>
                        <p className="small text-muted mb-0">Una volta scaduti non è possibile votare, ma puoi consultare i report dei risultati pubblici.</p>
                    </div>
                </div>
              </div>
            </section>

            <hr className="my-5 border-light" />
            <section id="moderazione" className="scroll-margin-top">
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" 
                     style={{ width: 52, height: 52, backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' }}>
                  <svg className="icon icon-md"><use href="/svg/sprites.svg#it-warning-circle"></use></svg>
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">Regole di Moderazione</h2>
                    <span className="small text-muted text-uppercase ls-1 fw-bold">Linee guida rapide</span>
                </div>
              </div>
              
              <p className="text-muted mb-4">
                Per mantenere la piattaforma un luogo costruttivo, vietiamo rigorosamente:
              </p>

              <div className="row g-3">
                  <div className="col-md-4">
                      <div className="p-3 border border-danger border-opacity-25 bg-danger bg-opacity-10 rounded-3 h-100 text-center">
                          <span className="d-block fw-bold text-danger mb-1">Offese e Insulti</span>
                          <p className="x-small text-muted mb-0">Rispetto reciproco sempre.</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="p-3 border border-danger border-opacity-25 bg-danger bg-opacity-10 rounded-3 h-100 text-center">
                          <span className="d-block fw-bold text-danger mb-1">Spam / Adv</span>
                          <p className="x-small text-muted mb-0">Nessuna pubblicità.</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="p-3 border border-danger border-opacity-25 bg-danger bg-opacity-10 rounded-3 h-100 text-center">
                          <span className="d-block fw-bold text-danger mb-1">Fuori Tema</span>
                          <p className="x-small text-muted mb-0">Solo competenza comunale.</p>
                      </div>
                  </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      <style jsx>{`
        .scroll-margin-top { scroll-margin-top: 100px; }
        .ls-1 { letter-spacing: 0.5px; }
        .x-small { font-size: 0.8rem; }
      `}</style>
    </div>
  )
}