import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['300', '400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Glialink',
  description: 'Making research discoverable, communicable, and impactful.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}