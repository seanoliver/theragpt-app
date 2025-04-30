import { BottomSheetHandleProps } from '@gorhom/bottom-sheet'
import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import { toRad } from 'react-native-redash'
import { useTheme } from '../../lib/theme/context'
import { Theme } from '../../lib/theme/theme'

// @ts-expect-error - Third-party library type compatibility issues
export const transformOrigin = ({ x, y }, ...transformations) => {
  'worklet'
  return [
    { translateX: x },
    { translateY: y },
    ...transformations,
    { translateX: x * -1 },
    { translateY: y * -1 },
  ]
}

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>
}

export const BottomSheetHandle = ({ style, animatedIndex }: HandleProps) => {
  //#region animations
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(animatedIndex.value, [0, 1, 2], [-1, 0, 1], Extrapolate.CLAMP),
  )
  //#endregion

  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  //#region styles
  const containerStyle = useMemo(() => [styles.header, style], [style])
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderTopRadius = interpolate(
      animatedIndex.value,
      [1, 2],
      [20, 0],
      Extrapolate.CLAMP,
    )
    return {
      borderTopLeftRadius: borderTopRadius,
      borderTopRightRadius: borderTopRadius,
      backgroundColor: theme.colors.foregroundBackground,
    }
  })
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator,
    }),
    [],
  )
  const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(-30), 0, toRad(30)],
      Extrapolate.CLAMP,
    )
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${leftIndicatorRotate}rad`,
        },
        {
          translateX: -5,
        },
      ),
    }
  })
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator,
    }),
    [],
  )
  const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(30), 0, toRad(-30)],
      Extrapolate.CLAMP,
    )
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${rightIndicatorRotate}rad`,
        },
        {
          translateX: 5,
        },
      ),
    }
  })
  //#endregion

  // render
  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle]}
      renderToHardwareTextureAndroid={true}
    >
      <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
      <Animated.View
        style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
      />
    </Animated.View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      backgroundColor: theme.colors.foregroundBackground,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
    },
    indicator: {
      position: 'absolute',
      width: 10,
      height: 4,
      backgroundColor: theme.colors.hoverAccent,
    },
    leftIndicator: {
      borderTopStartRadius: 2,
      borderBottomStartRadius: 2,
    },
    rightIndicator: {
      borderTopEndRadius: 2,
      borderBottomEndRadius: 2,
    },
  })
