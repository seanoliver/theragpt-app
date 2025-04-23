import theme from '@/apps/mobile/lib/theme'
import React, { useState, useCallback, useRef } from 'react'
import {
  View,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'

interface ResponsiveLargeTextProps {
  text: string
  containerWidth: number
  containerHeight: number
}

const DEFAULT_FONT_SIZE = 28
const DEFAULT_LINE_HEIGHT = 40
const MIN_FONT_SIZE = 20

export const ResponsiveLargeText = ({
  text,
  containerWidth,
  containerHeight,
}: ResponsiveLargeTextProps) => {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [lineHeight, setLineHeight] = useState(DEFAULT_LINE_HEIGHT)
  const [contentHeight, setContentHeight] = useState(0)
  const [didFit, setDidFit] = useState(false)

  const contentMeasured = useRef(false)

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      setContentHeight(height)
      if (!didFit) {
        if (height > containerHeight && fontSize > MIN_FONT_SIZE) {
          setFontSize(prev => Math.max(prev - 2, MIN_FONT_SIZE))
          setLineHeight(prev => Math.max(prev - 3, MIN_FONT_SIZE + 4))
        } else {
          setDidFit(true)
        }
      }
      contentMeasured.current = true
    },
    [containerHeight, fontSize, didFit],
  )

  const content = (
    <View onLayout={handleLayout} key={fontSize} style={styles.container}>
      <Text
        style={{
          color: theme.colors.textOnBackground,
          fontSize,
          lineHeight,
        }}
      >
        {text}
      </Text>
    </View>
  )

  const shouldScroll = contentHeight > containerHeight

  return (
    <View
      style={{
        width: containerWidth,
        maxHeight: containerHeight,
        alignSelf: 'center',
      }}
    >
      {shouldScroll ? (
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
})
