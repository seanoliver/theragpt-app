import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../../lib/theme/context'
import { useFocusEffect } from 'expo-router'
import { Theme } from '@/apps/mobile/lib/theme'

const StepRow = ({
  iconName,
  text,
  delay,
}: {
  iconName: keyof typeof Ionicons.glyphMap
  text: string
  delay: number
}) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600)}
      style={styles.stepRow}
    >
      <Ionicons
        name={iconName}
        size={18}
        color={theme.colors.textOnBackground}
        style={styles.stepIcon}
      />
      <Text style={styles.stepText}>{text}</Text>
    </Animated.View>
  )
}

export const ArchiveEmptyState = () => {
  const [animationKey, setAnimationKey] = useState(0)

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(prev => prev + 1)
    }, []),
  )

  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  return (
    <View style={styles.container} key={animationKey}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <Ionicons
          name="bookmark-outline"
          size={48}
          color={theme.colors.textOnBackground}
          style={styles.icon}
        />
        <Text style={styles.title}>Nothing here... yet</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(150).duration(600)}>
        <Text style={styles.subtitle}>
          This is your quiet shelf in the dark — a place for early sparks and
          half-formed thoughts.
        </Text>
      </Animated.View>

      <StepRow
        iconName="sparkles-outline"
        text="Tuck away stray words, quotes, and fragments that might become something someday."
        delay={300}
      />
      <StepRow
        iconName="leaf-outline"
        text="Let them sit. Revisit when the moment feels right. Shape them slowly."
        delay={500}
      />
      <StepRow
        iconName="sunny-outline"
        text="When an idea finds its form, move it into your active deck and let it shine."
        delay={700}
      />

      {/* <Animated.View entering={FadeInUp.delay(900).duration(600)}>
        <View style={styles.ctaContainer}>
          <Text style={styles.cta}>
            <Text style={styles.ctaIcon}>✍️</Text> Tap the <Text style={styles.ctaPlus}>+</Text> to start capturing a thought.
          </Text>
        </View>
      </Animated.View> */}
    </View>
  )
}
const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: 32,
    },
    icon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.textOnBackground,
      fontFamily: theme.fontFamilies.headerSerif,
      marginBottom: 32,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textOnBackground,
      textAlign: 'left',
      fontFamily: theme.fontFamilies.bodySans,
      marginBottom: 16,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      color: theme.colors.text,
    },
    stepIcon: {
      marginTop: 2,
      marginRight: 12,
    },
    stepText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.textOnBackground,
      textAlign: 'left',
      fontFamily: theme.fontFamilies.bodySans,
    },
    cta: {
      fontSize: 15,
      color: theme.colors.textOnBackground,
      fontFamily: theme.fontFamilies.bodySans,
      textAlign: 'center',
    },
    ctaContainer: {
      backgroundColor: theme.colors.hoverBackground,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      alignSelf: 'stretch',
      alignItems: 'center',
      marginTop: 32,
      ...theme.rnShadows.subtle,
    },
    ctaIcon: {
      fontSize: 18,
      marginRight: 4,
    },
    ctaPlus: {
      fontWeight: '700',
      color: theme.colors.textOnBackground,
      fontSize: 18,
    },
  })
