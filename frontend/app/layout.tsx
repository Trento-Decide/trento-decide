import type { Metadata } from "next";

import BootstrapClient from "./components/BootstrapClient";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Trento Decide",
  description: "Of base",
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
        <Header />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
