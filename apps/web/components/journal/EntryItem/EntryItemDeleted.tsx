'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EntryItemDeletedProps {
  onUndoDelete: () => void
}

export const EntryItemDeleted = ({ onUndoDelete }: EntryItemDeletedProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Entry has been deleted</p>
          <Button variant="outline" onClick={onUndoDelete}>
            Undo Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}