import Link from 'next/link'
import Breadcrumb from '../components/Breadcrumb'

export default function ProposteList() {
  const proposals = [
    {
      id: 1,
      title: "Creare una pista ciclabile tra Piazza Dante e l'Università",
      votes: "1.0k",
      tag: "Mobilità",
      author: "@youssef",
      date: "27/02/2026",
      description: "Proposta per creare un collegamento ciclabile sicuro tra Piazza Dante e l'Università di Trento (Povo).",
      status: "In discussione"
    },
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
  ]

  return (
    <div className="container my-4">
      <Breadcrumb />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Proposte</h1>
        <Link href="/proposte/crea" className="btn btn-primary">
          Nuova Proposta
        </Link>
      </div>

      <div className="row">
        <div className="col-12">
          {proposals.map(proposal => (
            <div key={proposal.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-1 col-3 text-center d-flex flex-column align-items-center justify-content-center border-end">
                    <span className="fw-bold text-primary fs-5">{proposal.votes}</span>
                    <span className="text-muted small">voti</span>
                  </div>
                  <div className="col-md-11 col-9 ps-md-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap">
                      <h5 className="card-title mb-1 me-2">
                        <Link href={`/proposte/${proposal.id}`} className="text-decoration-none text-dark fw-bold">
                          {proposal.title}
                        </Link>
                      </h5>
                      <span className={`badge rounded-pill ${proposal.status === 'Aperta' ? 'text-bg-success' : proposal.status === 'In discussione' ? 'text-bg-warning' : 'text-bg-secondary'} mb-2 mb-md-0`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="badge text-bg-light border me-2 text-dark">{proposal.tag}</span>
                      <small className="text-muted">
                        Proposto da <span className="fw-bold">{proposal.author}</span> il {proposal.date}
                      </small>
                    </div>
                    <p className="card-text text-muted d-none d-md-block">
                      {proposal.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
