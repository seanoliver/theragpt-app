import { DisplayCard } from './useCardData'

/**
 * Filters the cards by search query.
 * Case-insensitive, matches text and (optionally) other meta fields.
 */
export const filterCardData = (
  cards: DisplayCard[],
  query: string,
): DisplayCard[] => {
  if (!query) return cards
  const lower = query.toLowerCase()
  return cards.filter(
    s => s.text.toLowerCase().includes(lower),
    // Add more fields to search as needed (e.g., s.category)
  )
}
