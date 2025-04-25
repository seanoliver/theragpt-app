import React from 'react'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { Dimensions, View } from 'react-native'
import { Card } from '@still/logic/src/cards/service'
import { ReviewCard } from './ReviewCard'
import { handleVote, VoteType } from './cardVoteHandler'
import { cardInteractionService } from '@still/logic/src/card-interaction/service'

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
  // Stubbed handlers for Listen, Upvote, Downvote
  const handleListen = (card: Card) => {
    // TODO: Replace with real logic
    // eslint-disable-next-line no-console
    console.log('Listen pressed for card:', card.id)
  }

  const handleUpvote = async (card: Card) => {
    try {
      await handleVote(card.id, 'upvote', cardInteractionService)
    } catch (error) {
      // Optionally show error to user
      // eslint-disable-next-line no-console
      console.error('Upvote failed for card:', card.id, error)
    }
  }

  const handleDownvote = async (card: Card) => {
    try {
      await handleVote(card.id, 'downvote', cardInteractionService)
    } catch (error) {
      // Optionally show error to user
      // eslint-disable-next-line no-console
      console.error('Downvote failed for card:', card.id, error)
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
          onPageSelected(e.nativeEvent.position)
        }
        key={cards.length} // Ensures re-render if cards change
      >
        {cards.map((card, index) => (
          <View key={card.id || index} style={{ flex: 1 }}>
            <ReviewCard
              card={card}
              onListen={() => handleListen(card)}
              onUpvote={() => handleUpvote(card)}
              onDownvote={() => handleDownvote(card)}
              themeObject={themeObject}
            />
          </View>
        ))}
      </PagerView>
    </View>
  )
}
