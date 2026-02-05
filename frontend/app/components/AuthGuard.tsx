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
    const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path))
    const [isChecking, setIsChecking] = useState(!isPublicPath)

    useEffect(() => {
        const token = getAccessToken()

        if (!token && !isPublicPath) {
            router.replace("/accedi")
        } else if (isChecking) {
            setIsChecking(false)
        }
    }, [pathname, router, isPublicPath, isChecking])

    if (isChecking) {
        return null
    }

    return <>{children}</>
}
