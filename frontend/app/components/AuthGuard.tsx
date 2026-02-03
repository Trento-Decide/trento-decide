"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getAccessToken } from "@/lib/local"

const PUBLIC_PATHS = ["/accedi", "/registrati"]

interface AuthGuardProps {
    children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = getAccessToken()
        const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path))

        if (!token && !isPublicPath) {
            router.replace("/accedi")
        } else {
            setIsAuthenticated(!!token || isPublicPath)
            setIsChecking(false)
        }
    }, [pathname, router])

    // Show nothing while checking auth on protected routes
    if (isChecking && !PUBLIC_PATHS.some(path => pathname?.startsWith(path))) {
        return null
    }

    return <>{children}</>
}
