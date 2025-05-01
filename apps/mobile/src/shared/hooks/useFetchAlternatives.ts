import { useState, useCallback } from 'react'
import { getEnvironment } from '@theragpt/config'
import { TONES } from '../AIOptionsModal/constants'

export const useFetchAlternatives = () => {
  const [alternatives, setAlternatives] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAlternatives = useCallback(async (value: string) => {
    setLoading(true)
    setError(null)
    setAlternatives([])
    const env = getEnvironment(true)
    try {
      const res = await fetch(`${env.THERAGPT_API_BASE_URL}/api/rephrase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card: value,
          tones: TONES,
        }),
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.alternatives)) {
        setAlternatives(data.alternatives)
      } else {
        setError(data.error || 'Failed to fetch alternatives')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch alternatives')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    alternatives,
    loading,
    error,
    fetchAlternatives,
    setError,
    setAlternatives,
  }
}
