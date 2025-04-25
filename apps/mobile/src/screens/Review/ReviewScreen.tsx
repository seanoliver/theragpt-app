import { useTheme } from '@/apps/mobile/lib/theme/context'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useCardService } from '../../hooks/useCardService'
import { CardPager } from './components/CardPager'
import { Theme } from '@/apps/mobile/lib/theme/theme'
import { useCardInteractionService } from '@/apps/mobile/src/shared/hooks/useCardInteractionService'
export const ReviewScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { service, cards } = useCardService()

  const { themeObject } = useTheme()
  const styles = makeStyles(themeObject)

  if (!service || !cards) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardPagerContainer}>
        <CardPager
          cards={cards}
          currentIndex={currentIndex}
          onPageSelected={setCurrentIndex}
          themeObject={themeObject}
        />
      </View>

      {/* Progress Bar */}
      <View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
    },
    cardPagerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressBarContainer: {
      height: 1,
      backgroundColor: theme.colors.hoverBackground,
    },
    progressBar: {
      height: 10,
      backgroundColor: theme.colors.hoverPrimary,
    },
  })
