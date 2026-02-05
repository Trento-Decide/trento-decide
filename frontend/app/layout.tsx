import type { Metadata } from "next";

import BootstrapClient from "@/app/components/BootstrapClient";
import AuthClient from "@/app/components/AuthClient";
import AuthGuard from "@/app/components/AuthGuard";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Trento Decide",
  description: "Of base", // TODO: description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <BootstrapClient />
        <AuthClient />
        <AuthGuard>
          <Header />
          <main className="flex-grow-1">
            {children}
          </main>
          <Footer />
        </AuthGuard>
      </body>
    </html>
  );
}
