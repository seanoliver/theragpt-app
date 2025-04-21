import { Statement } from '@still/logic/src/statement/statementService'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import theme from '../../lib/theme'
import { useStatementService } from '../hooks/useStatementService'

export function EditStatementScreen() {
  const { statementId } = useLocalSearchParams<{ statementId: string }>()
  const [statement, setStatement] = useState<Statement | null>(null)
  const [text, setText] = useState('')
  const { service, statements } = useStatementService()

  useEffect(() => {
    if (statements && statementId) {
      const foundStatement = statements.find(a => a.id === statementId)
      if (foundStatement) {
        setStatement(foundStatement)
        setText(foundStatement.text)
      }
    }
  }, [statementId, statements])

  const handleSave = async () => {
    if (statement && service) {
      await service.update({
        id: statement.id,
        text,
      })
      router.push(`/daily?statementId=${statement.id}`)
    }
  }

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }
  if (!statement) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href={`/daily?statementId=${statement.id}`} asChild>
          <TouchableOpacity>
            <Text style={styles.backButton}>← Back to Statement</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Enter your statement"
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    color: theme.colors.textOnBackground,
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  input: {
    color: theme.colors.textOnBackground,
    fontSize: 24,
    padding: 20,
    backgroundColor: theme.colors.hoverBackground,
    borderRadius: 10,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.hoverBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: theme.colors.textOnBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: theme.colors.textOnBackground,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
  },
})
