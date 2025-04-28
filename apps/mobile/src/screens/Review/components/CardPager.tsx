import { cardInteractionService, Card } from '@still/logic'
import React, { useEffect, useRef } from 'react'
import { Dimensions, View } from 'react-native'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { ReviewCard } from './ReviewCard'

const { width: REVIEW_SCREEN_WIDTH, height: REVIEW_SCREEN_HEIGHT } =
  Dimensions.get('window')

type CardPagerProps = {
  cards: Card[]
  currentIndex: number
  onPageSelected: (index: number) => void
  themeObject: any
}

export const CardPager = ({
  cards,
  currentIndex,
  onPageSelected,
  themeObject,
}: CardPagerProps) => {
  const handleListen = (card: Card) => {
    // TODO: Replace with real logic
    // eslint-disable-next-line no-console
    console.log('Listen pressed for card:', card.id)
  }

  // Track which cards have been logged to avoid duplicate logs
  const loggedCardIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (cards[currentIndex] && !loggedCardIds.current.has(cards[currentIndex].id)) {
      cardInteractionService.logReview(cards[currentIndex].id)
      loggedCardIds.current.add(cards[currentIndex].id)
      // eslint-disable-next-line no-console
      console.log('Review logged for card:', cards[currentIndex].id)
    }
  }, [currentIndex, cards])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PagerView
        style={{
          width: REVIEW_SCREEN_WIDTH * 0.9,
          height: REVIEW_SCREEN_HEIGHT * 0.6,
        }}
        initialPage={0}
        pageMargin={20}
        orientation="horizontal"
        overdrag={true}
        onPageSelected={(e: PagerViewOnPageSelectedEvent) =>
          onPageSelected(e.nativeEvent.position)
        }
        key={cards.length} // Ensures re-render if cards change
      >
        {cards.map((card, index) => (
          <View key={card.id || index} style={{ flex: 1 }}>
            <ReviewCard
              card={card}
              onListen={() => handleListen(card)}
              themeObject={themeObject}
            />
          </View>
        ))}
      </PagerView>
    </View>
  )
}
