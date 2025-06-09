'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { EntryItem } from '@/components/journal/EntryItem/EntryItem'
import { EntryPageTracker } from '@/components/journal/EntryPageTracker'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouteProtection } from '@/lib/auth-utils'
import { AuthLoadingSpinner } from '@/components/auth/AuthLoadingSpinner'

export default function EntryDetailPage() {
  const params = useParams()
  const { shouldShowLoading, shouldRender } = useRouteProtection()
  const [entryId, setEntryId] = useState<string>('')

  useEffect(() => {
    if (params?.id) {
      setEntryId(Array.isArray(params.id) ? params.id[0] : params.id)
    }
  }, [params])

  if (shouldShowLoading) {
    return <AuthLoadingSpinner />
  }

  if (!shouldRender) {
    return null
  }

  if (!entryId) {
    return <AuthLoadingSpinner />
  }

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
          <EntryPageTracker entryId={entryId} />
          <EntryItem entryId={entryId} />
        </div>
      </div>
    </main>
  )
}
