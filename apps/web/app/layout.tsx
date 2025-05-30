import type React from 'react'
import type { Metadata } from 'next'
import { Quicksand, Lora, Oxygen } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from '../components/PostHogProvider'
import { ThemeProvider } from '@/apps/web/components/layout/theme/ThemeProvider'
import { EntryStoreProvider } from '@/apps/web/components/journal/store/EntryStoreProvider'
import { BackgroundTexture } from '@/apps/web/components/layout/BackgroundTexture'
import { Footer } from '../components/layout/Footer'
import { PageTracker } from '@/apps/web/components/layout/PageTracker'

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

export const generateMetadata = async (): Promise<Metadata> => {
  const isProd = process.env.NODE_ENV === 'production'
  const baseUrl = isProd ? 'https://theragpt.ai' : 'http://localhost:3000'

  return {
    title: 'TheraGPT - AI-Assisted CBT Journal',
    description:
      'TheraGPT is an AI-powered journal that helps you quickly record and process negative thoughts with CBT techniques.',
    openGraph: {
      title: 'TheraGPT - AI-Assisted CBT Journal',
      description:
        'TheraGPT is an AI-powered journal that helps you quickly record and process negative thoughts with CBT techniques.',
      siteName: 'TheraGPT',
      images: [
        {
          url: `${baseUrl}/assets/theragpt-social.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
      url: baseUrl + '/',
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${lora.variable} ${oxygen.variable} font-oxygen antialiased`}
      >
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <EntryStoreProvider>
              <PageTracker />
              <BackgroundTexture />
              <div className="min-h-screen relative z-10">
                {children}
                <Footer className="absolute bottom-0 w-full" />
              </div>
            </EntryStoreProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
