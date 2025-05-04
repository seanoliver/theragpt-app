'use client'

import { Button } from '@/apps/web/components/ui/button'
import { Card } from '@/apps/web/components/ui/card'
import Link from 'next/link'
import { ThoughtEntryForm } from '@/apps/web/components/thought-analysis/ThoughtEntryForm'
import { Header } from '@/apps/web/components/layout/Header'
import dynamic from 'next/dynamic'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <section className="mb-16 text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Welcome to TheraGPT
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Your AI-assisted CBT journaling companion to help process negative
            thoughts and build emotional resilience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
        </section>

        <section className="mb-16 animate-slide-up">
          <Card className="glass-panel shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">
              Quick Entry
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              What's something that's been bothering you today?
            </p>
            <ThoughtEntryForm />
          </Card>
        </section>

        <section
          className="grid md:grid-cols-3 gap-6 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <FeatureCard
            title="Identify Distortions"
            description="Learn to recognize patterns of negative thinking that contribute to emotional distress."
            icon="Brain"
          />
          <FeatureCard
            title="Reframe Thoughts"
            description="Transform negative thoughts into more balanced, realistic perspectives."
            icon="Lightbulb"
          />
          <FeatureCard
            title="Track Progress"
            description="Review your journal entries to see your growth and resilience over time."
            icon="LineChart"
          />
        </section>
      </div>
    </main>
  )
}

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) => {
  const IconComponent = dynamic<
    Omit<import('lucide-react').LucideProps, 'ref'>
  >(
    () =>
      import('lucide-react').then(mod => {
        const Icon = mod[icon as keyof typeof mod]
        // Only return if it's a valid LucideIcon (not a factory function)
        if (
          typeof Icon === 'function' &&
          !(Icon as any).iconNode // iconNode only exists on the factory, not on LucideIcon components
        ) {
          return Icon as React.ComponentType<
            Omit<import('lucide-react').LucideProps, 'ref'>
          >
        }
        return mod['Circle'] as React.ComponentType<
          Omit<import('lucide-react').LucideProps, 'ref'>
        >
      }),
    {
      ssr: false,
      loading: () => <div className="w-8 h-8" />,
    },
  )

  return (
    <Card className="glass-panel p-6 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4">
        <IconComponent className="w-6 h-6 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </Card>
  )
}
