import { Theme, useTheme } from '@/apps/mobile/lib/theme'
import { Card } from '@theragpt/logic'
import { StyleSheet, Text, View } from 'react-native'

export const CardSheetText = ({ card }: { card: Card }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={[styles.card]}>
      <Text style={[styles.cardText]}>{card.text}</Text>
    </View>
  )
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: theme.colors.foregroundBackground,
    },
    cardText: {
      fontSize: 16,
      lineHeight: 28,
      marginBottom: 8,
      color: theme.colors.textOnBackground,
    },
  })
}
