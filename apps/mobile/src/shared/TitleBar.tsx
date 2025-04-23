import theme, { getThemeByName } from '@/apps/mobile/lib/theme'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const sunsetTheme = getThemeByName('sunset')

export const TitleBar = () => {
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
        <Text style={[styles.headerTitle]}>Manifesto</Text>
        <Ionicons
          name="settings-outline"
          size={22}
          color={sunsetTheme.colors.accent}
          style={[styles.headerIcon]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerSection: {
    paddingBottom: 0,
    backgroundColor: sunsetTheme.colors.background,
  },
  headerRow: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: sunsetTheme.colors.border,
    paddingBottom: 12,
  },
  headerTitle: {
    textAlign: 'center',
    color: sunsetTheme.colors.textOnBackground,
    fontWeight: 'bold',
    fontSize: 16,

  },
  headerIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
