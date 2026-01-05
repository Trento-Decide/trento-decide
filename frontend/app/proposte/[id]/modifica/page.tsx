"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ProposalForm from "@/app/components/ProposalForm"
import Breadcrumb from "@/app/components/Breadcrumb"
import { getProposal, getCategories } from "@/lib/api"
import { getUserData } from "@/lib/local"
import { Proposal, CategoryRef } from "../../../../../shared/models"

export default function ModificaPropostaPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [categories, setCategories] = useState<CategoryRef[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
        setError("ID non valido")
        setLoading(false)
        return
    }

    const fetchData = async () => {
      try {
        const user = getUserData()
        const [propData, catData] = await Promise.all([
          getProposal(id),
          getCategories()
        ])

        if (user && propData.author.id !== user.id) {
           setError("Non hai i permessi per modificare questa proposta.")
        } else {
           setProposal(propData)
           setCategories(catData.data || catData) 
        }
      } catch (err) {
        console.error(err)
        setError("Impossibile caricare la proposta.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <div className="text-center py-5 text-muted">Caricamento editor...</div>
  
  if (error || !proposal) return (
    <div className="container py-5 text-center">
       <div className="alert alert-danger d-inline-block">{error || "Proposta non trovata"}</div>
       <div className="mt-3">
         <button className="btn btn-link" onClick={() => router.back()}>Torna indietro</button>
       </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: "#f5f5f7", minHeight: "100vh" }} className="py-5">
      <div className="container">
        
        <div className="mb-4">
            <Breadcrumb customLabels={{ 
                [String(id)]: proposal.title,
                "modifica": "Modifica" 
            }} />
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <ProposalForm initialData={proposal} categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
}