import theme, { getThemeByName } from '@/apps/mobile/lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const sunsetTheme = getThemeByName('sunset')

export const ManifestoHeader = () => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.headerSection,
        {
          paddingTop: insets.top + 12,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle]}>Your Manifesto</Text>
        <Ionicons
          name="sparkles-outline"
          size={22}
          color={sunsetTheme.colors.accent}
          style={[styles.headerIcon]}
        />
      </View>
      <View style={[styles.headerDivider]} />
    </View>
  )
}

const styles = StyleSheet.create({
  headerSection: {
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: sunsetTheme.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    textAlign: 'left',
    color: sunsetTheme.colors.textOnBackground,
    fontFamily: sunsetTheme.fontFamilies.headerSerif,
    fontWeight: '500',
    fontSize: 26,
    letterSpacing: 1.5,
  },
  headerIcon: {
    marginLeft: 12,
    opacity: 0.5,
  },
  headerDivider: {
    width: '100%',
    backgroundColor: sunsetTheme.colors.border,
    borderRadius: 1,
    alignSelf: 'center',
    height: 1,
    opacity: 0.1,
    marginTop: 8,
  },
})
