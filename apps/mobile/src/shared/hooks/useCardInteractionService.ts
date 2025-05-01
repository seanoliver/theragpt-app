import { useEffect, useMemo, useState } from 'react'
import { cardInteractionService, Totals } from '@theragpt/logic'
import { useCardStore } from '@/apps/mobile/src/store/useCardStore'

export const useCardInteractionService = (cardId: string, deps: any[] = []) => {
  const [totals, setTotals] = useState<Totals | null>(null)
  const card = useCardStore(state => state.cards.find(c => c.id === cardId))

  const handleUpvote = async () => {
    try {
      await cardInteractionService.logVote(cardId, 'upvote')
    } catch (error) {
      console.error('Upvote failed for card:', cardId, error)
    }
  }

  const handleDownvote = async () => {
    try {
      await cardInteractionService.logVote(cardId, 'downvote')
    } catch (error) {
      console.error('Downvote failed for card:', cardId, error)
    }
  }

  const getTotals = async () => {
    try {
      const totals = await cardInteractionService.getTotals(cardId)
      setTotals(totals)
      return totals
    } catch (error) {
      console.error('Totals failed for card:', cardId, error)
    }
  }

  const netVotes = useMemo(() => {
    if (!totals) {
      return 0
    }
    return totals.upvotes - totals.downvotes
  }, [totals])

  const reviewCount = useMemo(() => {
    if (!totals) {
      return 0
    }
    return totals.reviews
  }, [totals])

  useEffect(() => {
    getTotals()
  }, [cardId, card?.lastReviewed, card?.upvotes, card?.downvotes, card?.reviews, ...deps])

  return {
    handleUpvote,
    handleDownvote,
    netVotes,
    reviewCount,
    totals,
  }
}
