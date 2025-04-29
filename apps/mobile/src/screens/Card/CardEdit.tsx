import { Theme, useTheme } from '@/apps/mobile/lib/theme'
import { Card } from '@still/logic'
import { Ionicons } from '@expo/vector-icons'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native'
import { useCardStore } from '../../store/useCardStore'
import debounce from 'lodash/debounce'
import { useCallback, useRef, useEffect, useState } from 'react'

export const CardScreenEdit = ({ card }: { card: Card }) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const [text, setText] = useState(card.text)

  const updateCard = useCardStore(state => state.updateCard)

  const debouncedSave = useRef(
    debounce(async (newText: string) => {
      if (card && newText !== card.text) {
        await updateCard({ id: card.id, text: newText })
      }
    }, 300),
  )

  useEffect(() => {
    return () => {
      debouncedSave.current.cancel()
    }
  }, [])

  const handleChangeText = useCallback((newText: string) => {
    setText(newText)
    debouncedSave.current(newText)
  }, [])

  return (
    <View style={[styles.card]}>
      <TextInput
        style={[styles.cardText]}
        value={text}
        onChangeText={handleChangeText}
        multiline
      />
      <View style={styles.cardActionsRow}>
        <TouchableOpacity style={[styles.cardActionButton]}>
          <Ionicons
            name="volume-high-outline"
            size={18}
            color={theme.colors.textOnBackground}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.cardActionText]}>Read Aloud</Text>
        </TouchableOpacity>
      </View>
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
      ...theme.rnShadows.subtle,
    },
    cardText: {
      fontSize: 16,
      lineHeight: 28,
      marginBottom: 8,
      color: theme.colors.textOnBackground,
    },
    cardActionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
    },
    cardActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      backgroundColor: theme.colors.hoverBackground,
    },
    cardActionText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.textOnBackground,
    },
  })
}
