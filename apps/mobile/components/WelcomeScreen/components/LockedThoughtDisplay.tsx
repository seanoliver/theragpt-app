import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../lib/styles'
import { TEST_IDS } from '../lib/constants'
import { LockedThoughtDisplayProps } from '../lib/types'

/**
 * LockedThoughtDisplay shows the submitted thought in read-only format
 * Uses a minimalist design with serif font for a clean, elegant look
 */
const LockedThoughtDisplay: React.FC<LockedThoughtDisplayProps> = ({ thought }) => {
  return (
    <View
      style={styles.lockedThoughtContainer}
      testID={TEST_IDS.lockedThoughtDisplay}
    >
      <Text style={styles.lockedThoughtText}>{thought}</Text>
    </View>
  )
}

export default LockedThoughtDisplay