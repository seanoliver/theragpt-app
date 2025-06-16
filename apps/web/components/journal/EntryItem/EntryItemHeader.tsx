'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Calendar, Trash2 } from 'lucide-react'
import { formatRelativeTime } from '@/lib/date-utils'
import Link from 'next/link'

interface EntryItemHeaderProps {
  entryId: string
  title?: string
  category?: string
  createdAt: number
  onDelete: () => void
}

export const EntryItemHeader = ({
  entryId,
  title,
  category,
  createdAt,
  onDelete,
}: EntryItemHeaderProps) => {
  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-3">
        <Link href={`/entry/${entryId}`}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatRelativeTime(createdAt)}</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {category && <Badge variant="secondary">{category}</Badge>}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this entire entry? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {title && <h2 className="text-xl font-semibold">{title}</h2>}
    </div>
  )
}
