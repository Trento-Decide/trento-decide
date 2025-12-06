import Link from 'next/link'
import Breadcrumb from '../components/Breadcrumb'
import PropostaCard from '../components/PropostaCard'

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
            <PropostaCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </div>
  )
}
