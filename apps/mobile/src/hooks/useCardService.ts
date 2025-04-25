import { Card, cardService } from '@still/logic'
import { useEffect, useState } from 'react'

export const useCardService = (archived: boolean = false) => {
  const [ready, setReady] = useState(false)
  const [cards, setCards] = useState<Card[] | null>(null)

  useEffect(() => {
    let mounted = true
    let unsubscribe: (() => void) | undefined

    const initAndLoad = async () => {
      await cardService.init()
      if (!mounted) return

      setReady(true)

      const fetchedCards = archived
        ? cardService.getArchived
        : cardService.getActive

      // Need to .call(service) to bind 'this' to the service instance
      setCards(await fetchedCards.call(cardService))

      unsubscribe = cardService.subscribe(cards => {
        if (mounted)
          setCards(
            archived
              ? cardService.filterArchived(cards)
              : cardService.filterActive(cards),
          )
      })
    }

    initAndLoad()

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return { service: ready ? cardService : null, cards }
}
