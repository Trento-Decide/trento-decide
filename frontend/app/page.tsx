"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAccessToken } from "@/lib/local"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      router.replace("/proposte")
    } else {
      router.replace("/accedi")
    }
  }, [router])

  return null
}