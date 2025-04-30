import { useCardStore } from '@/apps/mobile/src/store/useCardStore'
import { Card } from '@still/logic'
import React, { useEffect } from 'react'
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
  loggedCardIds: React.MutableRefObject<Set<string>>
}

export const CardPager = ({
  cards,
  currentIndex,
  onPageSelected,
  themeObject,
  loggedCardIds,
}: CardPagerProps) => {
  const handleListen = (card: Card) => {
    // TODO: Replace with real logic
    // eslint-disable-next-line no-console
    console.log('Listen pressed for card:', card.id)
  }

  const reviewCard = useCardStore(state => state.reviewCard)

  useEffect(() => {
    const card = cards[currentIndex]
    if (card && !loggedCardIds.current.has(card.id)) {
      reviewCard(card.id)
      loggedCardIds.current.add(card.id)
      // eslint-disable-next-line no-console
      console.log('Review logged for card (store):', card.id)
    }
  }, [currentIndex, reviewCard])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PagerView
        style={{
          width: REVIEW_SCREEN_WIDTH * 0.9,
          height: REVIEW_SCREEN_HEIGHT * 0.6,
        }}
        pageMargin={20}
        orientation="horizontal"
        overdrag={true}
        onPageSelected={(e: PagerViewOnPageSelectedEvent) =>
          onPageSelected(e.nativeEvent.position)
        }
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
