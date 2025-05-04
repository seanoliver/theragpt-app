'use client'

import { Card } from '@/apps/web/components/ui/card'
import { ThoughtEntryForm } from '@/apps/web/components/thought-analysis/ThoughtEntryForm'
import { Header } from '@/apps/web/components/layout/Header'
import { HeroSection } from '@/apps/web/components/home/HeroSection'
import dynamic from 'next/dynamic'

interface HomePageProps {}

export const HomePage = ({}: HomePageProps) => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <HeroSection />

        <section className="mb-16 animate-slide-up">
          <Card className="glass-panel shadow-lg p-8">
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
      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200 font-heading">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 font-body">
        {description}
      </p>
    </Card>
  )
}
