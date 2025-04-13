import React, { useEffect } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { TEST_IDS } from '../lib/constants'
import {
  componentSpacing,
  fontSize,
} from '../lib/styles'
import { tokens } from '@/apps/mobile/lib/theme'
import { IMessage } from '../hooks'

export const Message = ({ message }: { message: IMessage }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const slideAnim = React.useRef(new Animated.Value(-20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <View
      style={[
        styles.messageContainer,
        { alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end' },
      ]}
      testID={TEST_IDS.chatBubble}
    >
      <Animated.Text
        style={[
          styles.messageText,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        accessibilityRole="header"
        accessibilityLabel={message.content}
      >
        {message.content}
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: componentSpacing,
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
    fontSize: fontSize,
    fontFamily: tokens.fontFamilies.serif,
    lineHeight: fontSize * 1.5,
  },
})
