'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, History, Smartphone, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface SignupEncouragementProps {
  onDismiss?: () => void
  className?: string
}

export const SignupEncouragement = ({ 
  onDismiss, 
  className = '', 
}: SignupEncouragementProps) => {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) {
    return null
  }

  return (
    <Card className={`border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 ${className}`}>
      <CardContent className="p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="pr-6">
          <div className="flex items-center mb-3">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full mr-3">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Keep your insights safe!
            </h3>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
            You're seeing this analysis as a guest. Sign up to save your entries, 
            track your progress over time, and access them from any device.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <History className="h-3 w-3 mr-1" />
              <span>Track progress</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Smartphone className="h-3 w-3 mr-1" />
              <span>Sync across devices</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link href="/signup">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}