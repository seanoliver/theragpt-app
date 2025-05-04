'use client'

import { Button } from '@/apps/web/components/ui/button'
import Link from 'next/link'

export const HeroSection = (): JSX.Element => {
  return (
    <section className="md:mt-16 mb-16 animate-fade-in">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col text-center gap-3">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text font-heading">
            Reframe your mindset. Reshape your life.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 w-full subheading">
            Your AI-assisted CBT journaling companion to help process negative
            thoughts and build emotional resilience.
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <Link href="/new-entry">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
                Start Journaling
              </Button>
            </Link>
            <Link href="/journal">
              <Button
                variant="outline"
                className="border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                View Journal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
