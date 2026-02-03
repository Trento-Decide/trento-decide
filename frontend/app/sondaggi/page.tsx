"use client"

import { useState, useEffect } from "react"

import { theme } from "@/lib/theme"
import PollCard from "@/app/components/PollCard"
import { PollSearchItem, ApiError } from "../../../shared/models"
import { getPolls } from "@/lib/api"
import ErrorDisplay from "../components/ErrorDisplay"
import Breadcrumb from "../components/Breadcrumb"
import Link from "next/link"

export default function PollList() {

    const [polls, setPolls] = useState<PollSearchItem[]>([])

    const [error, setError] = useState<ApiError | null>(null)

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await getPolls()
                setPolls(res)
            } catch (err: unknown) {
                if (err instanceof ApiError) {
                    setError(err)
                } else if (err instanceof Error) {
                    setError(new ApiError(err.message))
                }
            }
        }

        fetchPolls()
    }, [])

    if (error) {
        return (
            <div className="container my-4">
                <ErrorDisplay error={error} />
            </div>
        )
    }

    if (polls.length === 0) {
        return <div className="container my-4">Nessun sondaggio disponibile.</div>
    }

    return (
        <div className="container my-4">
            <Breadcrumb />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Sondaggi</h1>
                <Link href="/proposte/nuova" className="btn btn-primary">
                    Nuovo Sondaggio
                </Link>
            </div>

            <div className="row">
                <div className="col-12">
                    {polls.map(poll => (
                        <PollCard key={poll.id} poll={poll} />
                    ))}
                </div>
            </div>
        </div>
    )
}
