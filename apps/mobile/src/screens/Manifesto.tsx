import { affirmationService } from '@still/logic/src/affirmation/service'
import { Affirmation } from '@still/logic/src/affirmation/types'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors, tokens } from '../../lib/theme'
import { RenderedStatement } from '../shared/RenderedStatement'
import { SafeAreaView } from 'react-native-safe-area-context'

export function ManifestoScreen() {
  const [statements, setStatements] = useState<Affirmation[]>([])

  useEffect(() => {
    loadStatements()
  }, [])

  const loadStatements = async () => {
    const activeStatements = await affirmationService.getActiveAffirmations()
    setStatements(activeStatements)
  }

  const handleStatementPress = (statement: Affirmation) => {
    router.push(`/daily?statementId=${statement.id}`)
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
