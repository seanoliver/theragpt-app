import { useTheme } from '@/apps/mobile/lib/theme/context'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { useCardService } from '../../hooks/useCardService'
import { CardPager } from './components/CardPager'

export const ReviewScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { service, cards } = useCardService()

  const { themeObject } = useTheme()

  if (!service || !cards) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: themeObject.colors.background,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CardPager
          cards={cards}
          currentIndex={currentIndex}
          onPageSelected={setCurrentIndex}
          themeObject={themeObject}
        />
      </View>

      {/* Progress Bar */}
      <View>
        <View
          style={{
            height: 1,
            backgroundColor: themeObject.colors.hoverBackground,
          }}
        >
          <View
            style={{
              backgroundColor: themeObject.colors.hoverPrimary,
              height: 1,
              width: `${((currentIndex + 1) / cards.length) * 100}%`,
            }}
          />
        </View>
      </View>
    </View>
  )
}
