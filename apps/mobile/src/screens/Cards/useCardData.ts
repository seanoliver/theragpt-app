import { useState, useEffect, useCallback } from 'react'
import { useCardService } from '../../hooks/useCardService'
import { Card } from '@/packages/logic/src/cards/cards.service'

export interface DisplayCard {
  id: string
  text: string
  isActive?: boolean
  category?: string
  lastReviewed?: string
  netVotes?: number
  frequency?: 'More' | 'Less' | 'Normal'
  reviews?: number
}

interface UseCardDataResult {
  data: DisplayCard[]
  loading: boolean
  error: string | null
  createCard: () => Promise<void>
}

export const useCardData = (): UseCardDataResult => {
  const { service, cards } = useCardService()
  const [loading, setLoading] = useState(!cards)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(!cards)
  }, [cards])

  // Map raw cards to UI Card type
  const mapCard = (s: Card): DisplayCard => {
    const netVotes = s.upvotes && s.downvotes ? s.upvotes - s.downvotes : 0
    const frequency =
      netVotes === 0 ? undefined : netVotes > 0 ? 'More' : 'Less'
    const category = s.tags ? s.tags[0] : undefined

    return {
      id: s.id,
      text: s.text,
      category,
      isActive: s.isActive,
      lastReviewed: s.lastReviewed
        ? new Date(s.lastReviewed).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : '',
      netVotes,
      frequency,
      reviews: s.reviews ?? 0,
    }
  }

  const mappedCards = (cards || []).map(mapCard)

  const createCard = useCallback(async () => {
    if (!service) return
    try {
      setLoading(true)
      await service.create({ text: '', isActive: true })
      setLoading(false)
    } catch (e: any) {
      setError('Failed to create card')
      console.error('Error', e.message)
      setLoading(false)
    }
  }, [service])

  return {
    data: mappedCards,
    loading,
    error,
    createCard,
  }
}
