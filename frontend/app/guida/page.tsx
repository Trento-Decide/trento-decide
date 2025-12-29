import Link from "next/link"
import { theme } from "@/lib/theme"

export const metadata = {
  title: "Guida all'uso - Partecipa",
  description: "Scopri come proporre idee, votare e partecipare alla vita della tua città.",
}

export default function GuidePage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <h1 className="display-5 fw-bold mb-3" style={{ color: theme.primary }}>
            Come funziona Trento Decide?
          </h1>
          <p className="lead text-muted">
            Una guida semplice per trasformare le tue idee in azioni concrete per la città.
            Scopri come creare proposte, partecipare ai sondaggi e sostenere le iniziative degli altri cittadini.
          </p>
        </div>
      </div>

      <div className="row g-5">
        {/* SIDEBAR DI NAVIGAZIONE (Sticky su Desktop) */}
        <div className="col-lg-3 d-none d-lg-block">
          <div className="sticky-top" style={{ top: "2rem", zIndex: 1 }}>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="list-group list-group-flush rounded-3">
                  <a href="#account" className="list-group-item list-group-item-action py-3 border-0 fw-semibold">
                    1. Account e Profilo
                  </a>
                  <a href="#proposte" className="list-group-item list-group-item-action py-3 border-0 fw-semibold">
                    2. Creare una Proposta
                  </a>
                  <a href="#voti" className="list-group-item list-group-item-action py-3 border-0 fw-semibold">
                    3. Voti e Sostegno
                  </a>
                  <a href="#sondaggi" className="list-group-item list-group-item-action py-3 border-0 fw-semibold">
                    4. Partecipare ai Sondaggi
                  </a>
                  <a href="#moderazione" className="list-group-item list-group-item-action py-3 border-0 fw-semibold">
                    5. Regole di Moderazione
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-light rounded-3 border text-center">
              <p className="small mb-2">Hai bisogno di aiuto?</p>
              <Link href="mailto:supporto@comune.test" className="btn btn-sm btn-outline-dark">
                Contatta il supporto
              </Link>
            </div>
          </div>
        </div>

        {/* CONTENUTO PRINCIPALE */}
        <div className="col-lg-9">
          
          {/* SEZIONE 1: ACCOUNT */}
          <section id="account" className="mb-5 scroll-margin-top">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle me-3 text-white" style={{ width: 48, height: 48, backgroundColor: theme.primary }}>
                <svg className="icon icon-sm" style={{ fill: "white", width: 24, height: 24 }}><use href="/svg/sprites.svg#it-user"></use></svg>
              </div>
              <h2 className="h3 fw-bold mb-0">1. Account e Profilo</h2>
            </div>
            <div className="bg-white p-4 rounded-3 shadow-sm border-start border-4" style={{ borderColor: theme.primary }}>
              <p>
                Per garantire la qualità e la veridicità delle interazioni, molte funzioni della piattaforma richiedono la registrazione.
              </p>
              <ul className="mb-0">
                <li className="mb-2"><strong>Ospite (Non registrato):</strong> Può navigare tra le proposte pubbliche, leggere i dettagli e visualizzare i risultati dei sondaggi chiusi.</li>
                <li><strong>Cittadino Registrato:</strong> Può creare nuove proposte, votare (endorsement), aggiungere preferiti e partecipare ai sondaggi attivi.</li>
              </ul>
              <div className="mt-3">
                <Link href="/registrati" className="btn btn-primary text-white btn-sm">Crea un account ora</Link>
              </div>
            </div>
          </section>

          {/* SEZIONE 2: PROPOSTE */}
          <section id="proposte" className="mb-5 scroll-margin-top">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle me-3 text-white" style={{ width: 48, height: 48, backgroundColor: theme.dark ?? "#5c6f82" }}>
                <svg className="icon icon-sm" style={{ fill: "white", width: 24, height: 24 }}><use href="/svg/sprites.svg#it-pencil"></use></svg>
              </div>
              <h2 className="h3 fw-bold mb-0">2. Creare una Proposta</h2>
            </div>
            
            <p className="mb-4">
              Hai un'idea per migliorare il quartiere? Puoi inviarla all'amministrazione seguendo questi passaggi.
              Ogni proposta segue un ciclo di vita specifico:
            </p>

            

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h5 className="h6 fw-bold text-muted">1. Bozza</h5>
                    <p className="small mb-0">Inizia a scrivere la tua idea. Puoi salvarla e completarla in seguito. In questa fase è visibile solo a te.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h5 className="h6 fw-bold text-primary">2. Pubblicata</h5>
                    <p className="small mb-0">Una volta completa, pubblica la proposta. Ora è visibile a tutti e può ricevere voti dagli altri cittadini.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h5 className="h6 fw-bold text-warning">3. In Valutazione</h5>
                    <p className="small mb-0">Se la proposta raggiunge un certo consenso, viene presa in carico dall'amministrazione per uno studio di fattibilità.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h5 className="h6 fw-bold text-success">4. Approvata / In Attuazione</h5>
                    <p className="small mb-0">La proposta è stata accettata e inserita nel piano lavori della città.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-info d-flex align-items-center" role="alert">
              <svg className="icon icon-sm me-2 flex-shrink-0" style={{ fill: "currentColor", width: 20, height: 20 }}><use href="/svg/sprites.svg#it-info-circle"></use></svg>
              <div className="small">
                <strong>Nota bene:</strong> Compila tutti i campi richiesti (es. Budget stimato, Area geografica) per aumentare le probabilità che la tua proposta venga valutata positivamente.
              </div>
            </div>
          </section>

          {/* SEZIONE 3: VOTI */}
          <section id="voti" className="mb-5 scroll-margin-top">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle me-3 text-white" style={{ width: 48, height: 48, backgroundColor: "#e0ad16" }}>
                <svg className="icon icon-sm" style={{ fill: "white", width: 24, height: 24 }}><use href="/svg/sprites.svg#it-star-full"></use></svg>
              </div>
              <h2 className="h3 fw-bold mb-0">3. Voti e Sostegno</h2>
            </div>
            <p>
              Il sistema di voto serve a far emergere le idee più condivise dalla comunità.
            </p>
            <div className="card border-0 shadow-sm p-3">
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex flex-column align-items-center p-2 rounded bg-light border">
                  <svg className="icon icon-primary mb-1" style={{width:24, height:24}}><use href="/svg/sprites.svg#it-arrow-up-circle"></use></svg>
                  <span className="fw-bold">120</span>
                </div>
                <div>
                  <h5 className="fw-bold">Voto Positivo (+1)</h5>
                  <p className="mb-0 text-muted small">
                    Usa questo tasto se ritieni che la proposta sia utile per la città. Più voti positivi riceve una proposta, più salirà in classifica e attirerà l'attenzione dell'amministrazione.
                  </p>
                </div>
              </div>
              <hr className="my-3 opacity-10" />
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex flex-column align-items-center p-2 rounded bg-light border">
                  <svg className="icon icon-danger mb-1" style={{width:24, height:24}}><use href="/svg/sprites.svg#it-arrow-down-circle"></use></svg>
                  <span className="fw-bold">-5</span>
                </div>
                <div>
                  <h5 className="fw-bold">Voto Negativo (-1)</h5>
                  <p className="mb-0 text-muted small">
                    Usa questo tasto se pensi che la proposta non sia prioritaria, sia formulata male o sia dannosa.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SEZIONE 4: SONDAGGI */}
          <section id="sondaggi" className="mb-5 scroll-margin-top">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle me-3 text-white" style={{ width: 48, height: 48, backgroundColor: "#17a2b8" }}>
                <svg className="icon icon-sm" style={{ fill: "white", width: 24, height: 24 }}><use href="/svg/sprites.svg#it-chart-line"></use></svg>
              </div>
              <h2 className="h3 fw-bold mb-0">4. Partecipare ai Sondaggi</h2>
            </div>
            <p>
              A differenza delle proposte (create dai cittadini), i <strong>Sondaggi</strong> sono creati direttamente dall'Amministrazione o dai Moderatori per chiedere un parere specifico su un tema caldo.
            </p>
            <ul className="list-group list-group-flush shadow-sm rounded-3">
              <li className="list-group-item d-flex align-items-center">
                <span className="badge bg-success me-3">Attivi</span>
                <span>Puoi votare una sola volta. Il voto è anonimo a fini statistici, ma registrato per evitare duplicati.</span>
              </li>
              <li className="list-group-item d-flex align-items-center">
                <span className="badge bg-secondary me-3">Chiusi</span>
                <span>Una volta raggiunta la data di scadenza, non è più possibile votare, ma i risultati diventano pubblici.</span>
              </li>
            </ul>
          </section>

          {/* SEZIONE 5: MODERAZIONE */}
          <section id="moderazione" className="mb-5 scroll-margin-top">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle me-3 text-white" style={{ width: 48, height: 48, backgroundColor: "#d63c7e" }}>
                <svg className="icon icon-sm" style={{ fill: "white", width: 24, height: 24 }}><use href="/svg/sprites.svg#it-warning-circle"></use></svg>
              </div>
              <h2 className="h3 fw-bold mb-0">5. Regole di Moderazione</h2>
            </div>
            <p className="text-muted">
              Per mantenere la piattaforma un luogo costruttivo, ci riserviamo il diritto di rimuovere contenuti o sospendere utenti che violano le seguenti regole:
            </p>
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="p-3 border rounded h-100 bg-white">
                        <span className="d-block fw-bold text-danger mb-2">No Offese</span>
                        <p className="small mb-0">Linguaggio volgare, insulti personali o discriminatori non sono tollerati.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 border rounded h-100 bg-white">
                        <span className="d-block fw-bold text-danger mb-2">No Spam</span>
                        <p className="small mb-0">Pubblicità commerciale o proposte duplicate continuamente intasano il sistema.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 border rounded h-100 bg-white">
                        <span className="d-block fw-bold text-danger mb-2">Pertinenza</span>
                        <p className="small mb-0">Le proposte devono riguardare la competenza territoriale e temi di interesse pubblico.</p>
                    </div>
                </div>
            </div>
          </section>

        </div>
      </div>

      <style>{`
        .scroll-margin-top { scroll-margin-top: 100px; }
        .icon-primary { fill: ${theme.primary}; }
        .icon-danger { fill: #dc3545; }
      `}</style>
    </div>
  )
}