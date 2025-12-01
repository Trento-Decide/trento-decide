import type { Metadata } from "next"

import BootstrapClient from "./components/BootstrapClient"
import "./globals.scss"

export const metadata: Metadata = {
  title: "Trento Decide",
  description: "Of base",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <BootstrapClient />
        {children}
      </body>
    </html>
  )
}
