import React from 'react'
import { View, Text } from 'react-native'
import { SCREEN_WIDTH, BREAKPOINT_SMALL, BREAKPOINT_MEDIUM, TEST_IDS } from '../constants'
import { styles } from '../styles'
import { tokens } from '../../theme'
import { HeaderComponentProps } from '../types'

/**
 * HeaderComponent displays the main heading
 */
const HeaderComponent: React.FC<HeaderComponentProps> = () => {
  // Apply responsive font size based on screen width
  let fontSize = tokens.fontSizes.xl
  if (SCREEN_WIDTH < BREAKPOINT_SMALL) {
    fontSize = tokens.fontSizes.lg
  } else if (SCREEN_WIDTH < BREAKPOINT_MEDIUM) {
    fontSize = tokens.fontSizes.xl
  } else {
    fontSize = 28 // Larger than xl
  }

  return (
    <View style={styles.headerContainer} testID={TEST_IDS.headerComponent}>
      <Text
        style={[styles.headerText, { fontSize }]}
        accessibilityRole="header"
        accessibilityLabel="What's bothering you?"
      >
        What's bothering you?
      </Text>
    </View>
  )
}

export default HeaderComponent