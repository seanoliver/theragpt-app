import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, tokens } from '../../../lib/theme'
import { useStatementService } from '../../hooks/useStatementService'
import { StatementLineItem } from './components/StatementLineItem'
import { FAB } from '../../shared/FAB'
import { Ionicons } from '@expo/vector-icons'

export function ManifestoScreen() {
  const { service, statements } = useStatementService()
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    )
  }

  const handleDelete = (statementId: string) => {
    service.deleteStatement(statementId)
  }

  const handleArchive = (statementId: string) => {
    service.update({ id: statementId, isActive: false })
  }

  const handleAddStatement = async () => {
    if (!service) return
    const newStatement = await service.create({ text: '', isActive: true })
    setNewlyCreatedId(newStatement.id)
  }

  console.log('ManifestoScreen rendered')
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Manifesto</Text>
        <ScrollView
          style={styles.statementsList}
          keyboardShouldPersistTaps="handled"
        >
          {statements.map((statement, index) => (
            <React.Fragment key={statement.id}>
              <StatementLineItem
                statement={statement}
                onArchive={() => handleArchive(statement.id)}
                onDelete={() => handleDelete(statement.id)}
                autoFocus={statement.id === newlyCreatedId}
                onSave={() => {
                  if (statement.id === newlyCreatedId) setNewlyCreatedId(null)
                }}
              />
              {index < statements.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.charcoal[300],
                    width: '100%',
                    marginVertical: 8,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
      <FAB onPress={handleAddStatement}>
        <Ionicons name="add" size={32} color={colors.charcoal[100]} />
      </FAB>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 32,
    color: colors.text.primary,
    fontWeight: 'bold',
    fontFamily: tokens.fontFamilies.headerSerif,
  },
  content: {
    flex: 1,
    gap: 24,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 28,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontFamily: tokens.fontFamilies.headerSerif,
  },
  statementsList: {
    flex: 1,
    paddingRight: 4,
  },
})
