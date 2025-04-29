import { Theme, useTheme } from '@/apps/mobile/lib/theme'
import { Text, View, StyleSheet } from 'react-native'
import { Card } from '@/packages/logic'
import { Ionicons } from '@expo/vector-icons'
import { useMemo } from 'react'
import React from 'react'

interface CardSheetMenuProps {
  card: Card
}

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  label: string
}

export const CardSheetMenu = ({ card }: CardSheetMenuProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        onPress: () => {},
        icon: 'pencil-outline',
        label: 'Edit',
      },
      {
        icon: 'volume-high-outline',
        onPress: () => {},
        label: 'Listen',
      },
      {
        icon: 'archive-outline',
        onPress: () => {},
        label: 'Archive',
      },
      {
        icon: 'trash-outline',
        onPress: () => {},
        label: 'Delete',
      },
    ],
    [],
  )

  return (
    <View style={styles.container}>
      {menuItems.map(item => (
        <View key={item.label} style={styles.menuItem}>
          <View style={styles.circleButton}>
            <Text>
              <Ionicons name={item.icon} size={16} color={theme.colors.text} />
            </Text>
          </View>
          <Text style={styles.menuItemLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.foregroundBackground,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      bottom: 20,
      position: 'absolute',
      width: '100%',
    },
    circleButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItem: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    menuItemLabel: {
      fontSize: 10,
      color: theme.colors.text,
    },
  })
