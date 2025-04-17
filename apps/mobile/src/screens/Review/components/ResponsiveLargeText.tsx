import { colors } from '@/apps/mobile/lib/theme'
import Markdown from 'react-native-markdown-display'
import React, { useState, useCallback, useRef } from 'react'
import { View, LayoutChangeEvent, ScrollView, StyleSheet } from 'react-native'

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
      <Markdown
        style={{
          text: {
            color: colors.text.primary,
            fontSize,
            lineHeight,
          },
          bullet_list: { marginLeft: 0 },
          bullet_list_icon: {
            marginLeft: 0,
            marginRight: 8,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.text.primary,
            marginTop: 10,
          },
          ordered_list: { marginLeft: 0 },
          list_item: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 10,
          },
          body: {
            backgroundColor: colors.charcoal[100],
          },
        }}
      >
        {text}
      </Markdown>
    </View>
  )

  const shouldScroll = contentHeight > containerHeight
  console.log('contentHeight', contentHeight, containerHeight)

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
