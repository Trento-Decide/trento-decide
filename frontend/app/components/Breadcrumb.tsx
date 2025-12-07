"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbProps {
  customLabels?: { [segment: string]: string }
}

export default function Breadcrumb({ customLabels = {} }: BreadcrumbProps) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter((segment) => segment)

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link href="/">Home</Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`
          const isLast = index === pathSegments.length - 1

          let label = segment
          if (customLabels[segment]) {
            label = customLabels[segment]
          } else {
            // Capitalize
            label = label.charAt(0).toUpperCase() + label.slice(1)
          }

          return (
            <li
              key={href}
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {!isLast ? (
                <Link href={href}>{label}</Link>
              ) : (
                label
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
