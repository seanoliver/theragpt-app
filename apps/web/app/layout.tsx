import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
import { EntryStoreProvider } from '../components/entry-store-provider'
import { BackgroundTexture } from '../components/background-texture'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TheraGPT - AI-Assisted CBT Journaling',
  description: 'Process negative thoughts with AI-generated CBT techniques',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EntryStoreProvider>
            <BackgroundTexture />
            <div className="min-h-screen relative z-10">
              {children}
            </div>
          </EntryStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
