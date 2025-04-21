import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import theme, { getThemeByName } from '../../../lib/theme'
import { useStatementService } from '../../hooks/useStatementService'
import { FAB } from '../../shared/FAB'
import { ManifestoItem } from './ManifestoItem'

export function ManifestoScreen() {
  const { service, statements } = useStatementService()
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()
  const sunsetTheme = getThemeByName('sunset')

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
      style={[styles.container, { backgroundColor: sunsetTheme.colors.background }]}
    >
      <View style={[styles.headerSection, { paddingTop: insets.top + 12, backgroundColor: sunsetTheme.colors.background }]}>
        <View style={styles.headerRow}>
          <Text style={[
            styles.headerTitle,
            {
              color: sunsetTheme.colors.textOnBackground,
              fontFamily: sunsetTheme.fontFamilies.headerSerif,
              fontWeight: '500',
              fontSize: 26,
              letterSpacing: 1.5,
            },
          ]}>
            Your Manifesto
          </Text>
          <Ionicons
            name="sparkles-outline"
            size={22}
            color={sunsetTheme.colors.accent}
            style={[styles.headerIcon, { opacity: 0.5 }]}
          />
        </View>
        <View style={[
          styles.headerDivider,
          {
            backgroundColor: sunsetTheme.colors.border,
            height: 1,
            opacity: 0.10,
            marginTop: 8,
          },
        ]} />
      </View>
      <View style={styles.content}>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={[
            styles.statementsList,
            { backgroundColor: sunsetTheme.colors.background },
          ]}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {statements.map((statement, index) => (
            <React.Fragment key={statement.id}>
              <ManifestoItem
                statement={statement}
                size="lg"
                onArchive={() => handleArchive(statement.id)}
                onDelete={() => handleDelete(statement.id)}
                autoFocus={statement.id === newlyCreatedId}
                onSave={() => {
                  if (statement.id === newlyCreatedId) setNewlyCreatedId(null)
                }}
                style={index < statements.length - 1 ? { marginBottom: 20 } : undefined}
              />
            </React.Fragment>
          ))}
        </KeyboardAwareScrollView>
      </View>
      <FAB onPress={handleAddStatement} backgroundColor={sunsetTheme.colors.accent}>
        <Ionicons name="add" size={32} color={sunsetTheme.colors.textOnAccent} />
      </FAB>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
  },
  headerSection: {
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    fontSize: 30,
    color: theme.colors.textOnBackground,
    fontWeight: '600',
    fontFamily: theme.fontFamilies.headerSerif,
    letterSpacing: 1.2,
    textAlign: 'left',
    flex: 1,
  },
  headerIcon: {
    marginLeft: 12,
  },
  headerDivider: {
    marginTop: 10,
    height: 1.5,
    width: '100%',
    backgroundColor: theme.colors.border,
    borderRadius: 1,
    alignSelf: 'center',
    opacity: 0.18,
  },
  content: {
    flex: 1,
    gap: 24,
    marginTop: 0,
    paddingHorizontal: 24,
  },
  statementsList: {
    flex: 1,
    paddingRight: 4,
  },
  subtitle: {
    display: 'none',
  },
})
