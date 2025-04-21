import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import theme from '../../../lib/theme';
import { useStatementService } from '../../hooks/useStatementService';
import { ResponsiveLargeText } from './components/ResponsiveLargeText';

export const { width: REVIEW_SCREEN_WIDTH, height: REVIEW_SCREEN_HEIGHT } =
  Dimensions.get('window')

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
        <PagerView
          style={{ width: REVIEW_SCREEN_WIDTH * 0.9, height: REVIEW_SCREEN_HEIGHT * 0.5, alignSelf: 'center' }}
          initialPage={0}
          onPageSelected={(e: PagerViewOnPageSelectedEvent) => setCurrentIndex(e.nativeEvent.position)}
        >
          {statements.map((item, idx) => (
            <View key={item.id || idx} style={{ flex: 1 }}>
              <ResponsiveLargeText
                text={item.text}
                containerWidth={REVIEW_SCREEN_WIDTH * 0.9}
                containerHeight={REVIEW_SCREEN_HEIGHT * 0.5}
              />
            </View>
          ))}
        </PagerView>

        {/* Progress Bar */}
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
    backgroundColor: theme.colors.background,
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
    color: theme.colors.textOnBackground,
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
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
  progressText: {
    color: theme.colors.textOnBackground,
    fontSize: 16,
    opacity: 0.7,
  },
})
