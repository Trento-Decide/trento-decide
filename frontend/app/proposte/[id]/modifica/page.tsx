"use client"

import { useParams } from "next/navigation"

import Breadcrumb from "@/app/components/Breadcrumb"
import PropostaForm from "@/app/components/PropostaForm"

export default function ModificaProposta() {
  const params = useParams()
  const id = params.id

  return (
    <div className="container my-4">
      <Breadcrumb customLabels={{ modifica: "Modifica Proposta", [id as string]: "Dettaglio" }} />

      <h1 className="mb-4 fw-bold">Modifica Proposta</h1>

      <div className="card shadow-sm p-4 border-0">
        <PropostaForm />
      </div>

      <div className="d-flex justify-content-between mt-5">
        <div className="d-flex gap-3">
          <button type="button" className="btn btn-secondary">Annulla</button>
        </div>
        <button type="button" className="btn btn-primary">Salva modifiche</button>
      </div>
    </div>
  )
}
