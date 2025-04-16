import { Statement } from '@still/logic/src/statement/types';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, tokens } from '../../lib/theme';
import { useStatementService } from '../hooks/useStatementService';
import { RenderedStatement } from '../shared/RenderedStatement';

export function ManifestoScreen() {
  const { service, statements } = useStatementService()

  const handleStatementPress = (statement: Statement) => {
    router.push(`/daily?statementId=${statement.id}`)
  }

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Manifesto</Text>
        <ScrollView style={styles.statementsList}>
          {statements.map((statement, index) => (
            <>
              <RenderedStatement key={statement.id} statement={statement} />
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
