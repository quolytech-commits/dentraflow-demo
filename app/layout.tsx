import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'DentraFlow — Platforma e Menaxhimit të Klinikës Dentare',
  description: 'Sistemi premium i menaxhimit të klinikës dentare. Organizoni pacientët, terminet dhe financat me lehtësi.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sq" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <div className="flex-1">{children}</div>
        <footer className="w-full border-t border-border bg-card py-3 text-center text-xs text-muted-foreground">
          © 2026 QuolyTech — Made by{' '}
          <a href="https://quolytech.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            QuolyTech.com
          </a>
        </footer>
      </body>
    </html>
  )
}
