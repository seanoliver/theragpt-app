import { CardInteractionService, DailySummary, Totals } from '@still/logic/src/card-interaction/service'

export type ReviewSummaryResult = {
  dailySummaries: DailySummary[]
  totals: Totals
  error?: unknown
}

/**
 * Fetches review daily summaries and totals.
 * @param cardInteractionService - The injected card interaction service.
 * @returns An object containing dailySummaries, totals, and optional error.
 */
export const fetchReviewSummaries = async (
  cardInteractionService: CardInteractionService
): Promise<ReviewSummaryResult> => {
  try {
    const [dailySummaries, totals] = await Promise.all([
      cardInteractionService.getDailySummaries(),
      cardInteractionService.getTotals(),
    ])
    return { dailySummaries, totals }
  } catch (error) {
    return { dailySummaries: [], totals: { reviews: 0, upvotes: 0, downvotes: 0 }, error }
  }
}