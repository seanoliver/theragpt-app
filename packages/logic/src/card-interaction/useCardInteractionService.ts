import { cardInteractionService } from './service'

export const useCardInteractionService = (cardId: string) => {
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

  const handleReview = async () => {
    try {
      await cardInteractionService.logReview(cardId)
    } catch (error) {
      console.error('Review failed for card:', cardId, error)
    }
  }

  const getTotals = async () => {
    try {
      return await cardInteractionService.getTotals(cardId)
    } catch (error) {
      console.error('Totals failed for card:', cardId, error)
    }
  }

  return { handleUpvote, handleDownvote, handleReview, getTotals }
}
