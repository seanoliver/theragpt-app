'use client'

import { HeroSection } from '@/apps/web/components/home/HeroSection'
import { Footer } from '@/apps/web/components/layout/Footer'
import { Header } from '@/apps/web/components/layout/Header'

export const HomePage = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex flex-1 items-center justify-center min-h-[70vh]">
        <div className="container max-w-5xl mx-auto px-4 py-8 flex flex-col gap-16">
          <HeroSection />
        </div>
      </div>
      <Footer className="absolute bottom-0 w-full" />
    </main>
  )
}
