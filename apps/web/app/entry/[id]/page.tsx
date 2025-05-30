import { EntryItem } from '@/apps/web/components/journal/EntryItem/EntryItem'
import { EntryPageTracker } from '@/apps/web/components/journal/EntryPageTracker'
import { Header } from '@/apps/web/components/layout/Header'
import { Button } from '@/apps/web/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
/**
 * IMPORTANT: This is a workaround for a type issue in Next.js 15.3.x
 *
 * In Next.js 15.3.x, the type system expects `params` in dynamic route components
 * to be a Promise<{ id: string }>, not a direct object { id: string }.
 *
 * This is unusual, and doesn't align with the standard Next.js behavior and documentation.
 */
export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params

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

        <h1 className="text-3xl font-bold gradient-text mb-8 font-heading">
          Journal Entry
        </h1>

        <div className="animate-fade-in">
          <EntryPageTracker entryId={resolvedParams.id} />
          <EntryItem entryId={resolvedParams.id} />
        </div>
      </div>
    </main>
  )
}
