import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getThemeByName } from '../../../lib/theme'
import { useStatementService } from '../../hooks/useStatementService'
import { FAB } from '../../shared/FAB'
import { TitleBar } from '../../shared/TitleBar'
import { ManifestoItem } from './ManifestoItem'
import { useTheme } from '@/apps/mobile/lib/theme.context';

export function ManifestoScreen() {
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const { themeObject } = useTheme()

  const { service, statements } = useStatementService()

  // Scroll to bottom after new statement is added and rendered
  useEffect(() => {
    if (
      newlyCreatedId &&
      statements &&
      statements.some(s => s.id === newlyCreatedId)
    ) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [newlyCreatedId, statements?.length])

  const handleDelete = (statementId: string) => {
    if (!service) return
    service.deleteStatement(statementId)
  }

  const handleArchive = (statementId: string) => {
    if (!service) return
    service.update({ id: statementId, isActive: false })
  }

  const handleSave = (statementId: string, text: string) => {
    if (!service) return
    service.update({ id: statementId, text })
    if (statementId === newlyCreatedId) setNewlyCreatedId(null)
  }

  const handleNew = async () => {
    if (!service) return
    const newStatement = await service.create({ text: '', isActive: true })
    setNewlyCreatedId(newStatement.id)
  }

  // TODO: Make this prettier
  if (!service || !statements) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ backgroundColor: themeObject.colors.background }}>
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 20,
          paddingBottom: 120,
        }}
      >
        {statements.map(statement => (
          <React.Fragment key={statement.id}>
            <ManifestoItem
              statement={statement}
              onArchive={() => handleArchive(statement.id)}
              onDelete={() => handleDelete(statement.id)}
              onSave={text => handleSave(statement.id, text)}
              autoFocus={statement.id === newlyCreatedId}
            />
          </React.Fragment>
        ))}
      </ScrollView>

      <FAB onPress={handleNew} backgroundColor={themeObject.colors.accent}>
        <Ionicons
          name="add"
          size={32}
          color={themeObject.colors.textOnAccent}
        />
      </FAB>
    </SafeAreaView>
  )
}
