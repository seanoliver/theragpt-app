import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getThemeByName } from '../../../lib/theme';
import { useStatementService } from '../../hooks/useStatementService';
import { FAB } from '../../shared/FAB';
import { ManifestoHeader } from './ManifestoHeader';
import { ManifestoItem } from './ManifestoItem';

const sunsetTheme = getThemeByName('sunset')

export function ManifestoScreen() {
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)

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
      <View style={styles.container}>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <ManifestoHeader />
      <View style={styles.content}>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={[styles.statementsList]}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {statements.map((statement, index) => (
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
        </KeyboardAwareScrollView>
      </View>

      <FAB onPress={handleNew} backgroundColor={sunsetTheme.colors.accent}>
        <Ionicons
          name="add"
          size={32}
          color={sunsetTheme.colors.textOnAccent}
        />
      </FAB>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: sunsetTheme.colors.background,
  },
  content: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 24,
  },
  statementsList: {
    flex: 1,
    paddingRight: 4,
    backgroundColor: sunsetTheme.colors.background,
  },
  subtitle: {
    display: 'none',
  },
})
