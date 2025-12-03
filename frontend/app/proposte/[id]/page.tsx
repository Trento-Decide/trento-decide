'use client'

import { useState } from 'react'
import Breadcrumb from '@/app/components/Breadcrumb'

export default function PropostaDettaglio() {
  const [isFavourited, setIsFavourited] = useState(false)

  const proposal = {
    id: 1,
    title: "Creare una pista ciclabile tra Piazza Dante e l'Università",
    votes: "1.0k",
    tag: "Mobilità",
    author: "@youssef",
    date: "27/02/2026 - 10:31 AM",
    description: "Proposta per creare un collegamento ciclabile sicuro tra Piazza Dante e l'Università di Trento (Povo). La tratta attuale risulta frammentata, con tratti pericolosi e discontinui. La proposta prevede una pista ciclabile protetta lungo l'asse viario principale.",
    category: "Mobilità → Infrastrutture ciclabili",
    length: "2,9 km",
    attachments: []
  }

  return (
    <div className="container my-4">
      <Breadcrumb
        customLabels={{
          [proposal.id.toString()]: proposal.title
        }}
      />

      <div className="row">
        <div className="col-md-1 text-center">
          <div className="d-flex flex-column align-items-center">
            <button className="btn btn-link p-0 text-primary" style={{ fontSize: '2rem', lineHeight: 1 }}>
              <svg className="icon icon-primary" aria-hidden="true">
                <use href="/svg/sprites.svg#it-arrow-up-circle"></use>
              </svg>
            </button>
            <span className="fw-bold text-primary" style={{ fontSize: '1.2rem' }}>{proposal.votes}</span>
          </div>
        </div>

        <div className="col-md-10">
          <h1 className="mb-3 fw-bold">{proposal.title}</h1>

          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <span className="badge rounded-pill text-bg-primary px-3 py-2">
                <svg className="icon icon-white icon-sm me-2" aria-hidden="true">
                  <use href="/svg/sprites.svg#it-car"></use>
                </svg>
                {proposal.tag}
              </span>
            </div>
            <div className="text-end text-muted small">
              <div><strong>Autore:</strong> {proposal.author}</div>
              <div><strong>Data di creazione:</strong> {proposal.date}</div>
            </div>
          </div>

          <section className="mb-4">
            <h4 className="fw-bold">Descrizione</h4>
            <p>{proposal.description}</p>
          </section>

          <section className="mb-4">
            <h4 className="fw-bold">Categoria</h4>
            <p>{proposal.category}</p>
          </section>

          <section className="mb-4">
            <h4 className="fw-bold">Mappa</h4>
            <div className="ratio ratio-21x9 bg-light border rounded overflow-hidden">
              <div className="d-flex align-items-center justify-content-center bg-secondary text-white">
                <span className="fs-5">Mappa: {proposal.title}</span>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h4 className="fw-bold">Lunghezza stimata</h4>
            <p>{proposal.length}</p>
          </section>

          <section className="mb-4">
            <h4 className="fw-bold">Allegati (opzionali)</h4>
            {proposal.attachments.length > 0 ? (
              <ul>
                {proposal.attachments.map((att, index) => <li key={index}>{att}</li>)}
              </ul>
            ) : (
              <p className="text-muted">Non ci sono allegati.</p>
            )}
          </section>
        </div>

        <div className="col-md-1">
          <div className="d-flex flex-column gap-2 sticky-top align-items-center" style={{ top: '20px' }}>
            <svg 
              className="icon icon-danger" 
              role="button"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsFavourited(!isFavourited)}
            >
              <title>{isFavourited ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}</title>
              <use href={`/svg/custom.svg#${isFavourited ? 'it-heart-full' : 'it-heart'}`}></use>
            </svg>
            <svg 
              className="icon icon-warning" 
              role="button" 
              style={{ cursor: 'pointer' }} 
            >
              <title>Modifica</title>
              <use href="/svg/sprites.svg#it-pencil"></use>
            </svg>
            <svg 
              className="icon icon-secondary" 
              role="button" 
              style={{ cursor: 'pointer' }} 
            >
              <title>Cronologia</title>
              <use href="/svg/sprites.svg#it-clock"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
