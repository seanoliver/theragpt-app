import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../lib/theme/context'
import { useCardService } from '../../hooks/useCardService'
import { FAB } from '../../shared/FAB'
import { ArchiveEmptyState } from './components/ArchiveEmptyState'
import { ArchiveLineItem } from './components/ArchiveLineItem'

export const ArchiveScreen = () => {
  const { service, cards } = useCardService(true)
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)

  const { themeObject: theme } = useTheme()

  if (!service || !cards) {
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

  const isEmpty = cards.length === 0

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
          {cards.map((statement, index) => (
            <React.Fragment key={statement.id}>
              <ArchiveLineItem
                statement={statement}
                onPublish={() =>
                  service.update({ id: statement.id, isActive: true })
                }
                onDelete={() => service.deleteStatement(statement.id)}
              />
              {index < cards.length - 1 && (
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
