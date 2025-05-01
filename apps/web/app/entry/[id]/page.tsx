import { Header } from '@/apps/web/components/header'
import { EntryDetail } from '@/apps/web/components/entry-detail'
import { Button } from '@/apps/web/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EntryDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Link href="/journal">
          <Button
            variant="ghost"
            className="mb-6 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Button>
        </Link>

        <h1 className="text-3xl font-bold gradient-text mb-8">Journal Entry</h1>

        <div className="animate-fade-in">
          <EntryDetail id={params.id} />
        </div>
      </div>
    </main>
  )
}
