import React, { useEffect } from 'react'
import { View, Text, Animated } from 'react-native'
import { TEST_IDS } from '../constants'
import { styles } from '../styles'

/**
 * HeaderComponent displays the main heading with a serif font
 */
const HeaderComponent: React.FC = () => {
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
    <View style={styles.headerContainer} testID={TEST_IDS.headerComponent}>
      <Animated.Text
        style={[
          styles.headerText,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        accessibilityRole="header"
        accessibilityLabel="What's on your mind?"
      >
        What's on your mind?
      </Animated.Text>
    </View>
  )
}

export default HeaderComponent