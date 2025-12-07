"use client"

import { useEffect } from "react"

import { checkToken } from "@/lib/local"

export default function AuthClient() {
  useEffect(() => {
    checkToken()
  }, [])

  return null
}
