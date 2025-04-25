import { CardInteractionService } from '@still/logic/src/card-interaction/service'

export type VoteType = 'upvote' | 'downvote'

/**
 * Persists a vote for a card using the provided CardInteractionService.
 *
 * This function calls `cardInteractionService.logVote`, which is responsible for
 * persisting the vote to the underlying storage backend (e.g., SQLite, AsyncStorage, etc.)
 * as configured in your StorageService implementation.
 *
 * @param cardId - The ID of the card to vote on.
 * @param voteType - 'upvote' or 'downvote'.
 * @param cardInteractionService - The injected card interaction service.
 * @returns Promise<void>
 */
export const handleVote = async (
  cardId: string,
  voteType: VoteType,
  cardInteractionService: CardInteractionService
): Promise<void> => {
  await cardInteractionService.logVote(cardId, voteType)
}