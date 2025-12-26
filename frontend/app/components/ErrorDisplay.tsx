"use client"

import { ApiError } from "../../../shared/models"

interface ErrorDisplayProps {
  error: ApiError
  className?: string
}

export default function ErrorDisplay({ error, className = "mt-4" }: ErrorDisplayProps) {
  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      {error.statusCode ? <strong>Errore {error.statusCode}: </strong> : <strong>Errore: </strong>}
      <span>{error.message}</span>
    </div>
  )
}
