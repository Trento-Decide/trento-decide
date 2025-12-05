"use client"

import PropostaCard from '../components/PropostaCard'

export default function Profilo() {
  const userData = {
    nome: "YOUSSEF",
    cognome: "BOUADOUD",
    email: "youssef.bouadoud@gmail.com",
    username: "@youssef",
    sesso: "Maschio",
  }

  const myProposals = [
    {
      id: 1,
      title: "Creare una pista ciclabile tra Piazza Dante e l'Università",
      votes: "1.0k",
      tag: "Mobilità",
      author: "@youssef",
      date: "27/02/2026",
      description: "Proposta per creare un collegamento ciclabile sicuro tra Piazza Dante e l'Università di Trento (Povo).",
      status: "In discussione"
    }
  ];

  const favoriteProposals = [
    {
      id: 2,
      title: "Riqualificazione Parco delle Albere",
      votes: "856",
      tag: "Verde Urbano",
      author: "@maria",
      date: "25/02/2026",
      description: "Installazione di nuove panchine e aree gioco per bambini nel parco.",
      status: "Aperta"
    },
    {
      id: 3,
      title: "Illuminazione pubblica via Belenzani",
      votes: "432",
      tag: "Sicurezza",
      author: "@luca",
      date: "20/02/2026",
      description: "Potenziamento dell'illuminazione notturna per migliorare la sicurezza.",
      status: "Chiusa"
    }
  ];

  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold">
        Profilo utente {userData.nome} {userData.cognome}
      </h1>

      <ul className="nav nav-tabs" id="profileTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active d-flex align-items-center"
            id="dati-tab"
            data-bs-toggle="tab"
            data-bs-target="#dati"
            type="button"
            role="tab"
            aria-controls="dati"
            aria-selected="true"
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/sprites.svg#it-user"></use>
            </svg>
            Dati personali
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link d-flex align-items-center"
            id="mie-proposte-tab"
            data-bs-toggle="tab"
            data-bs-target="#mie-proposte"
            type="button"
            role="tab"
            aria-controls="mie-proposte"
            aria-selected="false"
            tabIndex={-1}
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/sprites.svg#it-file"></use>
            </svg>
            Le mie proposte
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link d-flex align-items-center"
            id="preferiti-tab"
            data-bs-toggle="tab"
            data-bs-target="#preferiti"
            type="button"
            role="tab"
            aria-controls="preferiti"
            aria-selected="false"
            tabIndex={-1}
          >
            <svg className="icon icon-sm me-2" role="presentation" focusable="false">
              <use href="/svg/custom.svg#it-heart"></use>
            </svg>
            Preferiti
          </button>
        </li>
      </ul>

      <div className="tab-content mt-5" id="profileTabsContent">
        <div
          className="tab-pane fade show active"
          id="dati"
          role="tabpanel"
          aria-labelledby="dati-tab"
        >
          <form>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label htmlFor="nome" className="active">
                    Nome *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    value={userData.nome}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label htmlFor="cognome" className="active">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cognome"
                    value={userData.cognome}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label htmlFor="email" className="active">
                    Indirizzo email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={userData.email}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label className="active d-block">Password *</label>
                  <a
                    href="#"
                    className="text-decoration-none fw-bold"
                    style={{ color: "#006643" }} // Adjust color to match image green if needed, or use text-success
                  >
                    Aggiorna password
                  </a>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <div className="form-group mb-4">
                  <label htmlFor="username" className="active">
                    Username *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={userData.username}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="select-wrapper mb-4">
                  <label htmlFor="sesso" className="active">
                    Sesso *
                  </label>
                  <select className="form-select" id="sesso" defaultValue={userData.sesso}>
                    <option value="Maschio">Maschio</option>
                    <option value="Femmina">Femmina</option>
                    <option value="Altro">Altro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button type="button" className="btn btn-outline-secondary">
                Ignora modifiche
              </button>
              <button type="submit" className="btn btn-primary">
                Salva
              </button>
            </div>
          </form>
        </div>
        <div
          className="tab-pane fade"
          id="mie-proposte"
          role="tabpanel"
          aria-labelledby="mie-proposte-tab"
        >
          <div className="row">
            <div className="col-12">
              {myProposals.map(proposal => (
                <PropostaCard key={proposal.id} proposal={proposal} />
              ))}
              {myProposals.length === 0 && <p className="text-muted">Non hai ancora creato nessuna proposta.</p>}
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="preferiti"
          role="tabpanel"
          aria-labelledby="preferiti-tab"
        >
          <div className="row">
            <div className="col-12">
              {favoriteProposals.map(proposal => (
                <PropostaCard key={proposal.id} proposal={proposal} />
              ))}
              {favoriteProposals.length === 0 && <p className="text-muted">Non hai ancora aggiunto nessuna proposta ai preferiti.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
