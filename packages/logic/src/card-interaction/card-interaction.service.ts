import { v4 as uuidv4 } from 'uuid'
import { StorageService, storageService } from '../storage/storage.service'
import { cardService } from '../cards'

/**
 * Types
 */
export type CardInteractionAction = 'review' | 'upvote' | 'downvote'

export interface CardInteractionEntry {
  id: string
  cardId: string
  action: CardInteractionAction
  timestamp: number // ms since epoch
  date: string // YYYY-MM-DD
}

export interface DailySummary {
  date: string
  reviews: number
  upvotes: number
  downvotes: number
}

export interface Totals {
  reviews: number
  upvotes: number
  downvotes: number
}

const STORAGE_KEY = 'still_card_interaction_entries'

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function toISODate(ts: number): string {
  return new Date(ts).toISOString().split('T')[0]
}

function groupByDate(
  entries: CardInteractionEntry[],
): Record<string, DailySummary> {
  const summary: Record<string, DailySummary> = {}
  for (const entry of entries) {
    if (!summary[entry.date]) {
      summary[entry.date] = {
        date: entry.date,
        reviews: 0,
        upvotes: 0,
        downvotes: 0,
      }
    }
    if (entry.action === 'review') summary[entry.date].reviews += 1
    if (entry.action === 'upvote') summary[entry.date].upvotes += 1
    if (entry.action === 'downvote') summary[entry.date].downvotes += 1
  }
  return summary
}

function computeTotals(entries: CardInteractionEntry[]): Totals {
  return entries.reduce(
    (acc, entry) => {
      if (entry.action === 'review') acc.reviews += 1
      if (entry.action === 'upvote') acc.upvotes += 1
      if (entry.action === 'downvote') acc.downvotes += 1
      return acc
    },
    { reviews: 0, upvotes: 0, downvotes: 0 },
  )
}

function computeCurrentStreak(dailySummaries: DailySummary[]): number {
  // Assumes dailySummaries sorted DESC by date
  let streak = 0
  for (const day of dailySummaries) {
    if (day.reviews > 0) {
      streak += 1
    } else {
      break
    }
  }
  return streak
}

export class CardInteractionService {
  private storageService: StorageService
  private storageKey: string

  constructor(
    storageService: StorageService,
    storageKey: string = STORAGE_KEY,
  ) {
    this.storageService = storageService
    this.storageKey = storageKey
  }

  /**
   * Log a review action for a card.
   */
  async logReview(cardId: string): Promise<void> {
    await this.logAction(cardId, 'review')
  }

  /**
   * Log an upvote or downvote for a card.
   */
  async logVote(cardId: string, type: 'upvote' | 'downvote'): Promise<void> {
    await this.logAction(cardId, type)
  }

  /**
   * Internal: Log any action.
   */
  private async logAction(
    cardId: string,
    action: CardInteractionAction,
  ): Promise<void> {
    const now = Date.now()
    const date = toISODate(now)
    console.log('Logging action for card:', cardId, 'with action:', action)
    const entry: CardInteractionEntry = {
      id: uuidv4(),
      cardId,
      action,
      timestamp: now,
      date,
    }
    const entries = await this.getAllEntries()
    entries.push(entry)
    await this.saveAllEntries(entries)
    await this.updateCardMetadata(cardId, action)
  }

  /**
   * Update card metadata after action log.
   */
  private async updateCardMetadata(
    cardId: string,
    action: CardInteractionAction,
  ) {
    console.log('Updating card metadata for card:', cardId, 'with action:', action)
    const now = Date.now()

    const totals = await this.getTotals(cardId)
    console.log('Totals:', totals)
    if (action === 'review') {
      console.log('Updating last reviewed for card:', cardId)
      await cardService.update({
        id: cardId,
        lastReviewed: now,
      })
    } else if (action === 'upvote') {
      await cardService.update({
        id: cardId,
        upvotes: totals.upvotes,
      })
    } else if (action === 'downvote') {
      await cardService.update({
        id: cardId,
        downvotes: totals.downvotes,
      })
    }
  }
  /**
   * Get all interaction entries.
   */
  async getAllEntries(): Promise<CardInteractionEntry[]> {
    try {
      const data = await this.storageService.getItem<CardInteractionEntry[]>(
        this.storageKey,
      )
      return data || []
    } catch (error) {
      // Optionally log error
      return []
    }
  }

  /**
   * Save all entries (overwrites).
   */
  private async saveAllEntries(entries: CardInteractionEntry[]): Promise<void> {
    await this.storageService.setItem(this.storageKey, entries)
  }

  /**
   * Get daily summaries for the last N days (default 30).
   */
  async getDailySummaries(days: number = 30): Promise<DailySummary[]> {
    const entries = await this.getAllEntries()
    const grouped = groupByDate(entries)
    // Get last N days, sorted DESC
    const dates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1))
    return dates.slice(0, days).map(date => grouped[date])
  }

  /**
   * Get total counts for all time for a given card
   */
  async getTotals(cardId: string): Promise<Totals> {
    const entries = await this.getAllEntries()
    return computeTotals(entries.filter(entry => entry.cardId === cardId))
  }

  /**
   * Get total counts for all time across all cards
   */
  async getOverallTotals(): Promise<Totals> {
    const entries = await this.getAllEntries()
    return computeTotals(entries)
  }

  /**
   * Get current review streak (consecutive days with reviews, up to today).
   */
  async getCurrentStreak(): Promise<number> {
    const summaries = await this.getDailySummaries(365) // up to 1 year
    // Sort DESC by date, ensure today is first
    const today = getTodayISO()
    let sorted = summaries.sort((a, b) => (a.date < b.date ? 1 : -1))
    if (!sorted[0] || sorted[0].date !== today) {
      // Insert today with 0s if missing
      sorted = [
        { date: today, reviews: 0, upvotes: 0, downvotes: 0 },
        ...sorted,
      ]
    }
    return computeCurrentStreak(sorted)
  }
}

/**
 * Export a singleton instance using the default storage service.
 */
export const cardInteractionService = new CardInteractionService(storageService)
