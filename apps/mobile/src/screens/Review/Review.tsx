import { useTheme } from '@/apps/mobile/lib/theme.context'
import { useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { useStatementService } from '../../hooks/useStatementService'

export const { width: REVIEW_SCREEN_WIDTH, height: REVIEW_SCREEN_HEIGHT } =
  Dimensions.get('window')

export const ReviewScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { service, statements } = useStatementService()

  const { themeObject } = useTheme()

  if (!service || !statements) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: themeObject.colors.background,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <PagerView
          style={{
            width: REVIEW_SCREEN_WIDTH * 0.9,
            height: REVIEW_SCREEN_HEIGHT * 0.6,
          }}
          initialPage={0}
          pageMargin={20}
          orientation="horizontal"
          overdrag={true}
          onPageSelected={(e: PagerViewOnPageSelectedEvent) =>
            setCurrentIndex(e.nativeEvent.position)
          }
        >
          {statements.map((statement, index) => {
            return (
              <View
                key={index}
                style={{
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: themeObject.fontSizes.xxl,
                    color: themeObject.colors.text,
                  }}
                >
                  {statement.text}
                </Text>
              </View>
            )
          })}
        </PagerView>
      </View>

      {/* Progress Bar */}
      <View>
        <View
          style={{
            height: 1,
            backgroundColor: themeObject.colors.hoverBackground,
          }}
        >
          <View
            style={{
              backgroundColor: themeObject.colors.hoverPrimary,
              height: 1,
              width: `${((currentIndex + 1) / statements.length) * 100}%`,
            }}
          />
        </View>
      </View>
    </View>
  )
}
