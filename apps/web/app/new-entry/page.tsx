import { Header } from '@/apps/web/components/layout/Header'
import { ThoughtEntryForm } from '@/apps/web/components/thought-analysis/ThoughtEntryForm'
import { Card } from '@/apps/web/components/ui/card'

export default function NewEntryPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold gradient-text mb-8">
          New Journal Entry
        </h1>

        <Card className="glass-panel shadow-lg p-8 mb-8 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Share Your Thoughts
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            What's something that's been bothering you today? Write down a
            negative or troubling thought, and I'll help you analyze and reframe
            it using CBT techniques.
          </p>
          <ThoughtEntryForm />
        </Card>

        <div
          className="text-center text-slate-500 dark:text-slate-400 text-sm animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <p>
            Your entries are private and secure. We use AI to help you process
            your thoughts, not to collect your data.
          </p>
        </div>
      </div>
    </main>
  )
}
