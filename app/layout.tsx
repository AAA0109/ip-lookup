import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IP Lookup',
  description: 'IP Lookup Application',
  generator: 'aaron.maupin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
