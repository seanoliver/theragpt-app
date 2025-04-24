import { DisplayStatement } from './useManifestoData'

/**
 * Filters the manifesto statements by search query.
 * Case-insensitive, matches text and (optionally) other meta fields.
 */
export const filterManifestoData = (
  statements: DisplayStatement[],
  query: string,
): DisplayStatement[] => {
  if (!query) return statements
  const lower = query.toLowerCase()
  return statements.filter(
    s => s.text.toLowerCase().includes(lower),
    // Add more fields to search as needed (e.g., s.category)
  )
}
