import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import theme from '../../../lib/theme'
import { useStatementService } from '../../hooks/useStatementService'
import { FAB } from '../../shared/FAB'
import { ManifestoItem } from './ManifestoItem'

export function ManifestoScreen() {
  const { service, statements } = useStatementService()
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (
      newlyCreatedId &&
      statements &&
      statements.some(s => s.id === newlyCreatedId)
    ) {
      // Scroll to bottom after new statement is added and rendered
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

  const handleAddStatement = async () => {
    if (!service) return
    const newStatement = await service.create({ text: '', isActive: true })
    setNewlyCreatedId(newStatement.id)
  }

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Manifesto</Text>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={[
            styles.statementsList,
            { backgroundColor: theme.colors.background },
          ]}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {statements.map((statement, index) => (
            <React.Fragment key={statement.id}>
              <ManifestoItem
                statement={statement}
                onArchive={() => handleArchive(statement.id)}
                onDelete={() => handleDelete(statement.id)}
                autoFocus={statement.id === newlyCreatedId}
                onSave={() => {
                  if (statement.id === newlyCreatedId) setNewlyCreatedId(null)
                }}
              />
            </React.Fragment>
          ))}
        </KeyboardAwareScrollView>
      </View>
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
    padding: 25,
    paddingLeft: 10,
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
})
