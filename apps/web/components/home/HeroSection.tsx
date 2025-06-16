'use client'

import { ThoughtEntryForm } from '../thought-analysis/ThoughtEntryForm'

export const HeroSection = (): JSX.Element => {
  return (
    <section className="md:mt-16 mb-16 animate-fade-in">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col text-center gap-3">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text font-heading">
            Your thoughts deserve a second opinion.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 w-full subheading">
            TheraGPT helps you analyze and reframe unhelpful thoughts so you can
            think clearer and feel stronger.
          </p>
          <div className="animate-slide-up">
            {/* <Card className="glass-panel shadow-lg p-8"> */}
              <ThoughtEntryForm />
            {/* </Card> */}
          </div>
        </div>
      </div>
    </section>
  )
}
