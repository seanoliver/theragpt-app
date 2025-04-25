import { cardInteractionService, Card } from '@still/logic'
import React from 'react'
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
  onPageSelected,
  themeObject,
}: CardPagerProps) => {
  const handleListen = (card: Card) => {
    // TODO: Replace with real logic
    // eslint-disable-next-line no-console
    console.log('Listen pressed for card:', card.id)
  }

  const handleReview = async (cardIndex: number) => {
    try {
      await cardInteractionService.logReview(cards[cardIndex].id)
      onPageSelected(cardIndex)
      console.log('Review logged for card:', cards[cardIndex].id)
    } catch (error) {
      console.error('Review failed for card:', cards[cardIndex].id, error)
    }
  }

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
          handleReview(e.nativeEvent.position)
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
