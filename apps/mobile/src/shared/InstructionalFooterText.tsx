import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/apps/mobile/lib/theme/context'
import { Theme } from '@/apps/mobile/lib/theme/theme'

export const InstructionalFooterText = ({ text }: { text: string[] }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={styles.footerInstructions}>
      {text.map((line, index) => (
        <Text key={index} style={styles.footerText}>
          {line}
        </Text>
      ))}
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    footerInstructions: {
      marginTop: 10,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
      color: theme.colors.textOnBackground,
      opacity: 0.7,
    },
  })
