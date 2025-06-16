import { formatDistanceToNow, isValid } from 'date-fns'

/**
 * Safely formats a timestamp to a relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (timestamp: number): string => {
  try {
    // Ensure we have a valid timestamp
    if (!timestamp || typeof timestamp !== 'number') {
      return 'Unknown time'
    }

    const date = new Date(timestamp)

    // Check if the date is valid
    if (!isValid(date)) {
      return 'Invalid date'
    }

    return formatDistanceToNow(date, {
      addSuffix: true,
    })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'Unknown time'
  }
}

/**
 * Safely compares two timestamps for sorting (newest first)
 * @param a - First timestamp
 * @param b - Second timestamp
 * @returns Comparison result for Array.sort()
 */
export const compareTimestampsDesc = (a: number | undefined, b: number | undefined): number => {
  // Handle undefined/null values by treating them as very old dates
  const timestampA = a || 0
  const timestampB = b || 0

  return timestampB - timestampA
}

/**
 * Gets the current timestamp in milliseconds
 * @returns Current timestamp
 */
export const getCurrentTimestamp = (): number => {
  return Date.now()
}

