import { Card } from '@/packages/logic'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Theme, useTheme } from '@/apps/mobile/lib/theme'

export const CardScreenAIVariations = ({ card: _card }: { card: Card }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={[styles.variationSection]}>
      <View style={styles.variationHeaderRow}>
        <Text style={[styles.variationTitle]}>AI Variations</Text>
        <TouchableOpacity style={[styles.generateButton]}>
          <Text style={[styles.generateButtonText]}>Generate</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.variationPlaceholder}>
        <Text style={[styles.variationPlaceholderText]}>
          Generate AI variations of your affirmation to discover new
          perspectives and wording.
        </Text>
      </View>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    variationSection: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
      marginBottom: 18,
      backgroundColor: theme.colors.foregroundBackground,
      borderColor: theme.colors.borderSubtle,
    },
    variationHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    variationTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textOnBackground,
    },
    generateButton: {
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 18,
      backgroundColor: theme.colors.hoverBackground,
    },
    generateButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.textOnBackground,
    },
    variationPlaceholder: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    variationPlaceholderText: {
      fontSize: 14,
      textAlign: 'center',
      color: theme.colors.textOnBackground,
      opacity: 0.6,
    },
  })
