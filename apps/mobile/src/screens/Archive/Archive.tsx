import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors, tokens } from '../../../lib/theme'
import { useStatementService } from '../../hooks/useStatementService'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArchiveLineItem } from './components/ArchiveLineItem'

export function ArchiveScreen() {
  const { service, statements } = useStatementService(true)

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>Archive</Text>

      <ScrollView
        style={styles.statementsList}
        keyboardShouldPersistTaps="handled"
      >
        {statements.map((statement, index) => (
          <>
            <ArchiveLineItem
              key={statement.id}
              statement={statement}
              onArchive={() =>
                service.update({ id: statement.id, isActive: true })
              }
              onDelete={() => service.deleteStatement(statement.id)}
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

      <Link href="/new" asChild>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </Link>
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
