import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AISIM - Plataforma de Estudos",
  description: "Sua plataforma inteligente de preparação para ENEM e Concursos",
};

import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { VisitTracker } from "../components/VisitTracker";

import { ErrorBoundary } from "../components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <VisitTracker />
          <ThemeProvider>
            <Header />
            <div className="pt-[72px] pb-24 min-h-screen flex flex-col"> {/* Push content down to avoid overlap with fixed header and enable flex col for footer stickiness */}
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
