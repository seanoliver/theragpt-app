import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import theme from '../../../lib/theme'
import { useStatementService } from '../../hooks/useStatementService'
import { FAB } from '../../shared/FAB'
import { ArchiveEmptyState } from './components/ArchiveEmptyState'
import { ArchiveLineItem } from './components/ArchiveLineItem'
import React, { useState } from 'react'

export function ArchiveScreen() {
  const { service, statements } = useStatementService(true)
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>Archive</Text>

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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 32,
    color: theme.colors.textOnBackground,
    fontWeight: 'bold',
    fontFamily: theme.fontFamilies.headerSerif,
  },
  content: {
    flex: 1,
    gap: 24,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 28,
    color: theme.colors.textOnBackground,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontFamily: theme.fontFamilies.headerSerif,
  },
  statementsList: {
    flex: 1,
    paddingRight: 4,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    zIndex: 10,
  },
  fabButton: {
    backgroundColor: theme.colors.accent,
    width: 48,
    height: 48,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
