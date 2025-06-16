'use client'

import { EntryList } from '@/components/journal/EntryList'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouteProtection } from '@/lib/auth-utils'
import { AuthLoadingSpinner } from '@/components/auth/AuthLoadingSpinner'

export default function JournalPage() {
  const { shouldShowLoading, shouldRender } = useRouteProtection()

  if (shouldShowLoading) {
    return <AuthLoadingSpinner />
  }

  if (!shouldRender) {
    return null
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text font-heading">
            Your Journal
          </h1>
          <Link href="/new-entry">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* <Card className="glass-panel shadow-lg p-6 mb-8 animate-fade-in">
          <EntryFilters />
        </Card> */}

        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <EntryList />
        </div>
      </div>
    </main>
  )
}
