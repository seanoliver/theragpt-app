'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/apps/web/components/ui/button'
import { Textarea } from '@/apps/web/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { AIResponsePanel } from '@/apps/web/components/ai-response-panel'
import { Loader2 } from 'lucide-react'

export const ThoughtEntryForm = () => {
  const [thought, setThought] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!thought.trim()) return

    setIsSubmitting(true)

    // Simulate API call to analyze thought
    setTimeout(() => {
      setIsSubmitting(false)
      setShowResponse(true)
    }, 1500)
  }

  return (
    <div>
      {!showResponse ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Type your thought here..."
            className="min-h-[120px] border-slate-200 dark:border-slate-700 focus:border-purple-300 dark:focus:border-purple-700 focus:ring-purple-300 dark:focus:ring-purple-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0"
              disabled={isSubmitting || !thought.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Thought'
              )}
            </Button>
          </div>
        </form>
      ) : (
        <AIResponsePanel
          originalThought={thought}
          onSave={() => router.push('/journal')}
          onReset={() => {
            setThought('')
            setShowResponse(false)
          }}
        />
      )}
    </div>
  )
}
