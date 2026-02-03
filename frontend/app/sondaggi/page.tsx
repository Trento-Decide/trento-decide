"use client"

import { theme } from "@/lib/theme"
import PollCard from "@/app/components/PollCard"
import type { PollSearchItem } from "../../../shared/models"

// Dati mock per i sondaggi
const MOCK_POLLS: PollSearchItem[] = [
    {
        type: "sondaggio",
        id: 1,
        title: "Riqualificazione Piazza Dante",
        description: "Esprimi la tua opinione sul progetto di riqualificazione urbana di Piazza Dante. Vogliamo rendere la piazza più verde e vivibile per tutti i cittadini.",
        author: { id: 1, username: "Comune di Trento" },
        category: {
            id: 1,
            code: "urbanistica",
            labels: { it: "Urbanistica" },
            colour: "#0d6efd"
        },
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Scade tra 7 giorni
        date: "03 Feb 2026",
        timestamp: new Date().toISOString(),
        isFavourited: false
    },
    {
        type: "sondaggio",
        id: 2,
        title: "Nuovi orari biblioteca comunale",
        description: "Sondaggio per valutare l'estensione degli orari di apertura della biblioteca comunale nel weekend. La proposta prevede l'apertura anche la domenica mattina.",
        author: { id: 1, username: "Comune di Trento" },
        category: {
            id: 2,
            code: "cultura",
            labels: { it: "Cultura" },
            colour: "#d63384"
        },
        isActive: true,
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Scade tra 2 giorni
        date: "01 Feb 2026",
        timestamp: new Date().toISOString(),
        isFavourited: true
    },
    {
        type: "sondaggio",
        id: 3,
        title: "Piano mobilità sostenibile 2026",
        description: "Consultazione pubblica sul nuovo piano per la mobilità sostenibile. Focus su piste ciclabili e trasporto pubblico locale.",
        author: { id: 1, username: "Comune di Trento" },
        category: {
            id: 3,
            code: "mobilita",
            labels: { it: "Mobilità" },
            colour: "#198754"
        },
        isActive: false,
        expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Scaduto da 5 giorni
        date: "20 Gen 2026",
        timestamp: new Date().toISOString(),
        isFavourited: false
    }
]

export default function SondaggiPage() {
    return (
        <div className="container py-5">
            <div className="text-center mb-5 animate-fade-in">
                <h1 className="display-5 fw-bold mb-3" style={{ color: theme.primary }}>
                    Sondaggi Istituzionali
                </h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                    Partecipa alle consultazioni ufficiali del Comune. La tua opinione ci aiuta a prendere decisioni migliori per la comunità.
                </p>
            </div>

            <div className="row g-4">
                {MOCK_POLLS.map((poll) => (
                    <div key={poll.id} className="col-md-6 col-lg-4">
                        <PollCard poll={poll} />
                    </div>
                ))}
            </div>

            {MOCK_POLLS.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-muted">Al momento non ci sono sondaggi attivi.</p>
                </div>
            )}


        </div>
    )
}
