import Link from "next/link"
import { theme } from "@/lib/theme"

export const metadata = {
  title: "Regolamento - CivicApp",
  description: "Linee guida per la partecipazione e la moderazione della piattaforma.",
}

export default function RegulationPage() {
  return (
    <div className="container py-5">
      
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3" style={{ color: theme.primary }}>
          Regolamento della Piattaforma
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          Per garantire uno spazio di dialogo costruttivo e democratico, chiediamo a tutti i cittadini di rispettare queste semplici linee guida.
        </p>
        <p className="small text-muted">
          Ultimo aggiornamento: <span className="fw-bold">29 Dicembre 2025</span>
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          
          <div className="card border-0 shadow-sm p-4 p-md-5">
            
            <section className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                  <span className="fw-bold fs-5">1</span>
                </div>
                <h2 className="h4 fw-bold mb-0">Chi può partecipare</h2>
              </div>
              <p>
                La partecipazione è aperta a tutti i cittadini residenti nel comune. Per inserire proposte o votare è necessaria la registrazione, che verifica l&apos;identità dell&apos;utente per garantire il principio &quot;una testa, un voto&quot;.
              </p>
              <ul className="list-unstyled text-muted ps-4 border-start border-3 border-light">
                <li className="mb-2">✅ Età minima: <strong>16 anni</strong>.</li>
                <li className="mb-2">✅ Obbligo di residenza.</li>
                <li>✅ Un solo account per persona fisica.</li>
              </ul>
            </section>

            <hr className="my-5 border-light" />

            <section className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                  <span className="fw-bold fs-5">2</span>
                </div>
                <h2 className="h4 fw-bold mb-0">Linee guida per le Proposte</h2>
              </div>
              <p>
                Ogni cittadino può avanzare proposte per migliorare la città. Affinché vengano approvate dai moderatori, le proposte devono rispettare i seguenti criteri:
              </p>
              <div className="row g-3 mt-2">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded h-100">
                    <h5 className="h6 fw-bold text-success">Cosa accettiamo</h5>
                    <ul className="small text-muted mb-0 ps-3">
                      <li>Idee di interesse collettivo (es. parchi, viabilità).</li>
                      <li>Proposte chiare con titolo e descrizione esaustivi.</li>
                      <li>Progetti fattibili a livello comunale.</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded h-100">
                    <h5 className="h6 fw-bold text-danger">Cosa rifiutiamo</h5>
                    <ul className="small text-muted mb-0 ps-3">
                      <li>Interessi puramente privati o commerciali.</li>
                      <li>Linguaggio offensivo, discriminatorio o d&apos;odio.</li>
                      <li>Proposte duplicate (controlla prima di scrivere!).</li>
                      <li>Questioni di competenza nazionale (non comunale).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <hr className="my-5 border-light" />

            <section className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                  <span className="fw-bold fs-5">3</span>
                </div>
                <h2 className="h4 fw-bold mb-0">Sondaggi Istituzionali</h2>
              </div>
              <p>
                I sondaggi presenti nella sezione dedicata sono creati direttamente dall&apos;Amministrazione per consultare i cittadini su temi specifici.
              </p>
              <p className="text-muted small">
                A differenza delle proposte, i sondaggi hanno una durata limitata. Una volta scaduti, i risultati vengono analizzati e pubblicati come report ufficiale.
              </p>
            </section>

            <hr className="my-5 border-light" />

            <section>
              <div className="d-flex align-items-center mb-3">
                <div className="icon-box bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                  <span className="fw-bold fs-5">4</span>
                </div>
                <h2 className="h4 fw-bold mb-0">Moderazione e Sanzioni</h2>
              </div>
              <p>
                La piattaforma è moderata attivamente. Ci riserviamo il diritto di rimuovere contenuti o sospendere account che violano ripetutamente queste regole.
              </p>
              <div className="alert alert-warning border-0 d-flex align-items-center" role="alert">
                <span className="me-2">⚠️</span>
                <div className="small">
                  Hai notato un contenuto inappropriato? Puoi segnalarlo cliccando sui tre puntini accanto al contenuto ed insererire una motivazione. Il nostro team di moderazione esaminerà la segnalazione nel più breve tempo possibile.
                </div>
              </div>
            </section>

          </div>

          <div className="text-center mt-5">
            <p className="mb-3">Hai letto tutto e sei pronto a contribuire?</p>
            <Link href="/proposte/crea" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
              Inizia subito
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}