"use client"

import { useEffect, useState } from "react"
import ProposalForm from "@/app/components/ProposalForm"
import Breadcrumb from "@/app/components/Breadcrumb"
import { getCategories } from "@/lib/api"
import { CategoryRef } from "../../../../shared/models"

export default function NuovaPropostaPage() {
  const [categories, setCategories] = useState<CategoryRef[]>([])
  
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error)
  }, [])

  return (
    <div style={{ backgroundColor: "#f5f5f7", minHeight: "100vh" }} className="py-5">
      <div className="container">
        
        <div className="mb-4">
           <Breadcrumb customLabels={{ "nuova": "Crea Proposta" }} />
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <ProposalForm categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
}