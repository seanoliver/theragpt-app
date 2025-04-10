import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles'
import { TEST_IDS } from '../constants'
import { LockedThoughtDisplayProps } from '../types'

/**
 * LockedThoughtDisplay shows the submitted thought in read-only format
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