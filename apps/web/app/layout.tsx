import type React from 'react'
import type { Metadata } from 'next'
import { Quicksand, Lora, Oxygen } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/apps/web/components/layout/theme/ThemeProvider'
import { EntryStoreProvider } from '@/apps/web/components/journal/store/EntryStoreProvider'
import { BackgroundTexture } from '@/apps/web/components/layout/BackgroundTexture'
import { Footer } from '../components/layout/Footer'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
})
const oxygen = Oxygen({
  subsets: ['latin'],
  variable: '--font-oxygen',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'TheraGPT - AI-Assisted CBT Journaling',
  description:
    'TheraGPT is an AI-powered journal that helps you quickly record and process negative thoughts with CBT techniques.',
  openGraph: {
    title: 'TheraGPT - AI-Assisted CBT Journaling',
    description:
      'TheraGPT is an AI-powered journal that helps you quickly record and process negative thoughts with CBT techniques.',
    siteName: 'TheraGPT',
    images: [
      {
        url: 'https://theragpt.ai/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
    url: 'https://theragpt.ai/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${lora.variable} ${oxygen.variable} font-oxygen antialiased`}
      >
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
              <Footer className="absolute bottom-0 w-full" />
            </div>
          </EntryStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
