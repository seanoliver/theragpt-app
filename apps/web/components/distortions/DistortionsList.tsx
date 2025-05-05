'use client'

import { useEffect, useState, useRef } from 'react'
import { Card } from '@/apps/web/components/ui/card'
import { Button } from '@/apps/web/components/ui/button'
import { Badge } from '@/apps/web/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PUBLIC_DISTORTIONS_LIST } from '@theragpt/logic'
import { DistortionIllustration } from './DistortionIllustration'

export const DistortionsList = () => {
  const [activeSection, setActiveSection] = useState<string>(
    PUBLIC_DISTORTIONS_LIST[0].id,
  )
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Set up intersection observer to detect active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setActiveSection(id)
            // Update URL hash without scrolling - using replaceState instead of setting location.hash
            // to avoid triggering additional scrolling
            history.replaceState(null, '', `#${id}`)
          }
        })
      },
      {
        root: null,
        rootMargin: '-50% 0px',
        threshold: 0,
      },
    )

    // Observe all section elements
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  // Handle initial hash in URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && sectionRefs.current[hash]) {
      // Use scrollIntoView with a small delay but don't use smooth behavior for initial load
      // to prevent cascade scrolling effect
      setTimeout(() => {
        sectionRefs.current[hash]?.scrollIntoView({ behavior: 'auto' })
        setActiveSection(hash)
      }, 100)
    }
  }, [])

  // Update the scrollToSection function to use a more controlled approach
  const scrollToSection = (id: string) => {
    if (sectionRefs.current[id]) {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  const scrollToNext = () => {
    const currentIndex = PUBLIC_DISTORTIONS_LIST.findIndex(
      d => d.id === activeSection,
    )
    if (currentIndex < PUBLIC_DISTORTIONS_LIST.length - 1) {
      scrollToSection(PUBLIC_DISTORTIONS_LIST[currentIndex + 1].id)
    }
  }

  const scrollToPrevious = () => {
    const currentIndex = PUBLIC_DISTORTIONS_LIST.findIndex(
      d => d.id === activeSection,
    )
    if (currentIndex > 0) {
      scrollToSection(PUBLIC_DISTORTIONS_LIST[currentIndex - 1].id)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* Sidebar Navigation */}
      <div className="md:w-64 lg:w-72 md:h-[calc(100vh-64px)] md:overflow-y-auto md:sticky md:top-16 glass-panel md:border-r border-slate-200 dark:border-slate-700 p-4 z-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold gradient-text mb-2 font-heading">
            Cognitive Distortions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-body">
            Common thinking patterns that can lead to negative emotions and
            behaviors.
          </p>
        </div>

        <nav className="space-y-1">
          {PUBLIC_DISTORTIONS_LIST.map(distortion => (
            <Button
              key={distortion.id}
              variant="ghost"
              className={cn(
                'w-full justify-start text-left font-normal',
                activeSection === distortion.id
                  ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
              onClick={() => scrollToSection(distortion.id)}
            >
              {distortion.title}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content with Snap Scrolling */}
      <div
        ref={containerRef}
        className="flex-1 h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {PUBLIC_DISTORTIONS_LIST.map(distortion => (
          <section
            key={distortion.id}
            id={distortion.id}
            ref={el => {
              sectionRefs.current[distortion.id] = el as HTMLDivElement
            }}
            className="h-[calc(100vh-64px)] snap-start p-6 md:p-10 flex flex-col justify-center"
          >
            <div className="max-w-3xl mx-auto">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
                Cognitive Distortion
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6 font-heading">
                {distortion.title}
              </h1>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <Card className="glass-panel p-6 h-full">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 font-heading">
                      Description
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 font-body">
                      {distortion.description}
                    </p>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2 subheading">
                      Example Thoughts:
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 font-body">
                      {distortion.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
                <div>
                  <Card className="glass-panel p-6 h-full flex flex-col">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 font-heading">
                      How to Overcome It
                    </h2>
                    <div className="flex-1 flex items-center justify-center p-4">
                      <DistortionIllustration type={distortion.id} />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2 subheading">
                        Reframing Strategy:
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        {distortion.reframing}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                  onClick={scrollToPrevious}
                  disabled={
                    PUBLIC_DISTORTIONS_LIST.findIndex(
                      d => d.id === activeSection,
                    ) === 0
                  }
                >
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {PUBLIC_DISTORTIONS_LIST.findIndex(
                    d => d.id === activeSection,
                  ) + 1}{' '}
                  of {PUBLIC_DISTORTIONS_LIST.length}
                </span>
                <Button
                  variant="outline"
                  className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                  onClick={scrollToNext}
                  disabled={
                    PUBLIC_DISTORTIONS_LIST.findIndex(
                      d => d.id === activeSection,
                    ) ===
                    PUBLIC_DISTORTIONS_LIST.length - 1
                  }
                >
                  Next
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}