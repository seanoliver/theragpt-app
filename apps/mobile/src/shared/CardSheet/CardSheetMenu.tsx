import { Theme, useTheme } from '@/apps/mobile/lib/theme'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Card } from '@/packages/logic'
import { Ionicons } from '@expo/vector-icons'
import { useMemo } from 'react'
import React from 'react'

interface CardSheetMenuProps {
  card: Card
  isEditing: boolean
  onEdit: () => void
}

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  label: string
  color: string
  textColor: string
}

export const CardSheetMenu = ({
  card,
  isEditing,
  onEdit,
}: CardSheetMenuProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        onPress: onEdit,
        icon: 'pencil-outline',
        label: 'Edit',
        color: isEditing
          ? theme.colors.accent
          : theme.colors.disabledBackground,
        textColor: isEditing ? theme.colors.white : theme.colors.text,
      },
      {
        icon: 'volume-high-outline',
        onPress: () => {},
        label: 'Listen',
        color: theme.colors.disabledBackground,
        textColor: theme.colors.text,
      },
      {
        icon: 'archive-outline',
        onPress: () => {},
        label: 'Archive',
        color: theme.colors.disabledBackground,
        textColor: theme.colors.text,
      },
      {
        icon: 'trash-outline',
        onPress: () => {},
        label: 'Delete',
        color: theme.colors.errorBackground,
        textColor: theme.colors.errorText,
      },
    ],
    [isEditing],
  )

  return (
    <View style={styles.container}>
      {menuItems.map(item => (
        <View key={item.label} style={styles.menuItem}>
          <TouchableOpacity
            onPress={item.onPress}
            style={[styles.circleButton, { backgroundColor: item.color }]}
          >
            <Text>
              <Ionicons name={item.icon} size={16} color={item.textColor} />
            </Text>
          </TouchableOpacity>
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
