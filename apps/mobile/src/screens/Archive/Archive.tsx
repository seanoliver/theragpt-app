import { useTheme } from '@/apps/mobile/lib/theme.context'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStatementService } from '../../hooks/useStatementService'
import { FAB } from '../../shared/FAB'
import { ArchiveEmptyState } from './components/ArchiveEmptyState'
import { ArchiveLineItem } from './components/ArchiveLineItem'

export function ArchiveScreen() {
  const { service, statements } = useStatementService(true)
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)

  const { themeObject: theme } = useTheme()

  if (!service || !statements) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text>Loading...</Text>
      </View>
    )
  }

  const isEmpty = statements.length === 0

  const handleAddStatement = async () => {
    if (!service) return
    const newStatement = await service.create({ text: '', isActive: false })
    setNewlyCreatedId(newStatement.id)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {isEmpty ? (
        <ArchiveEmptyState />
      ) : (
        <ScrollView
          style={styles.statementsList}
          keyboardShouldPersistTaps="handled"
        >
          {statements.map((statement, index) => (
            <React.Fragment key={statement.id}>
              <ArchiveLineItem
                statement={statement}
                onArchive={() =>
                  service.update({ id: statement.id, isActive: true })
                }
                onDelete={() => service.deleteStatement(statement.id)}
                autoFocus={statement.id === newlyCreatedId}
                onSave={() => {
                  if (statement.id === newlyCreatedId) setNewlyCreatedId(null)
                }}
              />
              {index < statements.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                    width: '100%',
                    marginVertical: 8,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      )}

      <FAB onPress={handleAddStatement}>
        <Ionicons name="add" size={32} color={theme.colors.background} />
      </FAB>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  statementsList: {
    flex: 1,
    paddingRight: 4,
  },
})
