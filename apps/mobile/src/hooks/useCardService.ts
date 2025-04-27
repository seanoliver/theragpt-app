import { Card, cardService } from '@still/logic'
import { useEffect, useState, useMemo } from 'react'

export const useCardService = (archived: boolean = false) => {
  const [ready, setReady] = useState(false)
  const [allCards, setAllCards] = useState<Card[] | null>(null)

  useEffect(() => {
    let mounted = true
    let unsubscribe: (() => void) | undefined

    const initAndLoad = async () => {
      await cardService.init()
      if (!mounted) return

      setReady(true)

      // Fetch all cards (active + archived)
      setAllCards(await cardService.getAll.call(cardService))

      unsubscribe = cardService.subscribe(cards => {
        if (mounted) setAllCards(cards)
      })
    }

    initAndLoad()

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // Memoize the filtered cards
  const cards = useMemo(() => {
    if (!allCards) return null
    return archived
      ? cardService.filterArchived(allCards)
      : cardService.filterActive(allCards)
  }, [allCards, archived])

  // Memoize a fast card lookup by ID using the service's Map
  const getCardById = (id: string) => {
    if (!allCards) return undefined
    return cardService.getCardById(id)
  }

  return { service: ready ? cardService : null, cards, getCardById }
}
