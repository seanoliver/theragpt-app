'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAutoMigration, useAuth } from '@theragpt/logic'

interface MigrationStatusProps {
  onComplete?: () => void
}

export function MigrationStatus({ onComplete }: MigrationStatusProps) {
  const { isAuthenticated } = useAuth()
  const {
    isMigrating,
    migrationError,
    migrationComplete,
    triggerMigration,
    clearMigrationState,
  } = useAutoMigration(true)

  useEffect(() => {
    if (migrationComplete) {
      // Auto close after showing success for 2 seconds
      const timer = setTimeout(() => {
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [migrationComplete, onComplete])

  // Don't show if user is not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Don't show if migration is complete and no error
  if (migrationComplete && !migrationError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Migration Complete!</CardTitle>
          <CardDescription>
            Your local journal entries have been synced to your account
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Show if migrating or has error
  if (isMigrating || migrationError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>
            {isMigrating ? 'Syncing Your Journal...' : 'Sync Failed'}
          </CardTitle>
          <CardDescription>
            {isMigrating 
              ? 'We\'re transferring your local entries to your account'
              : 'There was an issue syncing your local entries'
            }
          </CardDescription>
        </CardHeader>
        
        {migrationError && (
          <CardContent>
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-4">
              {migrationError}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={triggerMigration}
                className="flex-1"
                disabled={isMigrating}
              >
                Try Again
              </Button>
              <Button 
                onClick={() => {
                  clearMigrationState()
                  onComplete?.()
                }}
                variant="outline"
                className="flex-1"
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        )}
        
        {isMigrating && (
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return null
}