import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, tokens } from '../../../lib/theme'
import { useStatementService } from '../../hooks/useStatementService'
import { FAB } from '../../shared/FAB'
import { StatementLineItem } from './components/StatementLineItem'

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
      style={[styles.container, { backgroundColor: colors.charcoal[100] }]}
    >
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Manifesto</Text>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={[
            styles.statementsList,
            { backgroundColor: colors.charcoal[100] },
          ]}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
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
        </KeyboardAwareScrollView>
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
    padding: 25,
    paddingLeft: 10,
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
