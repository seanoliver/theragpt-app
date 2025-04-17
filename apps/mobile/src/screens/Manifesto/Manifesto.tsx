import { useRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, tokens } from '../../../lib/theme';
import { useStatementService } from '../../hooks/useStatementService';
import { StatementLineItem } from './components/StatementLineItem';

export function ManifestoScreen() {
  const { service, statements } = useStatementService()

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Manifesto</Text>
        <ScrollView style={styles.statementsList} keyboardShouldPersistTaps="handled">
          {statements.map((statement, index) => (
            <>
              <StatementLineItem
                key={statement.id}
                statement={statement}
                onArchive={() => {}}
                onDelete={() => handleDelete(statement.id)}
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
            </>
          ))}
        </ScrollView>
      </View>
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
