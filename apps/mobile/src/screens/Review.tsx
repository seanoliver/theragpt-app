import { useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { colors } from '../../lib/theme'
import { useStatementService } from '../hooks/useStatementService'
import { RenderedStatement } from '../shared/RenderedStatement'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export function ReviewScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { service, statements } = useStatementService()

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.statementContainer}>
        <Carousel
          width={SCREEN_WIDTH * 0.9}
          height={SCREEN_HEIGHT * 0.5}
          data={statements}
          scrollAnimationDuration={500}
          style={{ alignSelf: 'center' }}
          onSnapToItem={setCurrentIndex}
          renderItem={({ item }) => (
            <RenderedStatement
              statement={item}
              size="lg"
              containerStyle={styles.cardContainer}
              editable={false}
            />
          )}
        />
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / statements.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {statements.length}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    padding: 20,
  },
  statementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    width: '90%',
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '90%',
    height: 4,
    backgroundColor: colors.charcoal[300],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.text.primary,
    borderRadius: 2,
  },
  progressText: {
    color: colors.text.primary,
    fontSize: 16,
    opacity: 0.7,
  },
})
