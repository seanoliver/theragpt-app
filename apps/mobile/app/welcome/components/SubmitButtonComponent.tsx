import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { styles } from '../styles'
import { TEST_IDS } from '../constants'
import { SubmitButtonComponentProps } from '../types'

/**
 * SubmitButtonComponent for submitting the thought
 * Styled with a minimalist design to complement the overall UI
 */
const SubmitButtonComponent: React.FC<SubmitButtonComponentProps> = ({
  onPress,
  enabled,
  text,
  testID = TEST_IDS.submitThoughtButton,
  accessibilityLabel = 'Submit your thought',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        enabled ? styles.buttonEnabled : styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={!enabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !enabled }}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

export default SubmitButtonComponent