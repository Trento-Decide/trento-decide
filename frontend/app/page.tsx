"use client"

import Link from "next/link"

export default function Home() {
  const userName = "Alice"

  const recentUpdates = [
    {
      text: 'La proposta "Pedonalizzare Via Roma" è passata in valutazione',
      href: "/proposte/1",
      linkLabel: "Pedonalizzare Via Roma",
    },
    {
      text: 'Nuova modifica alla proposta che segui: "Illuminazione Via Brennero"',
      href: "/proposte/2",
      linkLabel: "Illuminazione Via Brennero",
    },
    {
      text: 'Hai ricevuto un endorsement sulla proposta "Viale Zara verde!"',
      href: "/proposte/3",
      linkLabel: "Viale Zara verde!",
    },
  ]

  const recentlyViewed = [
    { title: "Pedonalizzare Via Roma", href: "/proposte/1", votes: 132 },
    { title: "Pista ciclabile Trento Nord → Centro", href: "/proposte/4", votes: 76 },
  ]

  const activePolls = [
    {
      title: "Mobilità sostenibile nel centro storico",
      href: "/sondaggi/1",
      closes: "12/03",
    },
    {
      title: "Nuovi orari dei mezzi pubblici",
      href: "/sondaggi/2",
      closes: "18/03",
    },
  ]

  const categories = [
    "Mobilità",
    "Ambiente",
    "Urbanistica",
    "Cultura",
    "Sociale",
    "Innovazione",
  ]

  return (
    <div className="container my-4">
      <header className="mb-4">
        <h1 className="fw-bold mb-1">Bentornato @{userName}!</h1>
        <p className="text-muted mb-0">
          Ecco cosa è successo mentre non c&apos;eri <span>👇</span>
        </p>
      </header>

      <div className="row">
        <div className="col-lg-8">
          <section className="mb-4">
            <h2 className="h5 fw-bold mb-3">Aggiornamenti recenti</h2>
            <div className="bg-light border rounded-3 p-3">
              {recentUpdates.map((item, idx) => (
                <div
                  key={idx}
                  className={`py-2 ${idx !== recentUpdates.length - 1 ? "border-bottom" : ""}`}
                >
                  <Link href={item.href} className="fw-semibold">
                    {item.linkLabel}
                  </Link>{" "}
                  – {item.text.replace(item.linkLabel, "").trim()}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-3">Le tue proposte viste di recente</h2>
            <div className="bg-light border rounded-3 p-3">
              {recentlyViewed.map((p, idx) => (
                <div
                  key={idx}
                  className={`py-2 ${idx !== recentlyViewed.length - 1 ? "border-bottom" : ""}`}
                >
                  <Link href={p.href} className="fw-semibold">
                    {p.title}
                  </Link>{" "}
                  – {p.votes} voti
                </div>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-3">Sondaggi attivi</h2>
            <div className="bg-light border rounded-3 p-3">
              {activePolls.map((s, idx) => (
                <div
                  key={idx}
                  className={`py-2 ${idx !== activePolls.length - 1 ? "border-bottom" : ""}`}
                >
                  <Link href={s.href} className="fw-semibold">
                    {s.title}
                  </Link>{" "}
                  – <span className="text-muted">chiude il {s.closes}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <div className="bg-light border rounded-3 p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">Esplora per categoria</h2>
                <Link href="/categorie" className="text-decoration-none">
                  vai →
                </Link>
              </div>
              <ul className="mb-0">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link href={`/categorie/${encodeURIComponent(cat.toLowerCase())}`} className="text-decoration-underline">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-5">
            <h2 className="h6 text-success fw-bold mb-2">Come funziona?</h2>
            <ol className="mb-2">
              <li>Proponi idee</li>
              <li>Collabora o migliora le proposte</li>
              <li>Vota e partecipa alle decisioni</li>
              <li>Segui gli esiti e i report</li>
            </ol>
            <Link href="/guida" className="text-decoration-underline">
              Leggi la guida completa →
            </Link>
          </section>
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <aside className="bg-success text-white rounded-3 p-3">
            <h2 className="h6 fw-bold mb-2">Utenti online</h2>
            <p className="small mb-1">
              LupicGregor, Marcolume, Lorenzo_ITA, PaoloCive93, RiccardoA, Enrico_91, Gabriele_Simeoni,
              Fulvio87, Matteo_S, FedericaG, GentaLorenzi, ...
            </p>
            <p className="small mb-0">
              e altri 344.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}