import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { colors } from '../../lib/theme'
import { statementService } from '@still/logic/src/statement/statementService'
import { Statement } from '@still/logic/src/statement/types'

export function EditStatementScreen() {
  const { statementId } = useLocalSearchParams<{ statementId: string }>()
  const [statement, setStatement] = useState<Statement | null>(null)
  const [text, setText] = useState('')

  useEffect(() => {
    loadStatement()
  }, [statementId])

  const loadStatement = async () => {
    if (statementId) {
      const statements = await statementService.getAllStatements()
      const foundStatement = statements.find(a => a.id === statementId)
      if (foundStatement) {
        setStatement(foundStatement)
        setText(foundStatement.text)
      }
    }
  }

  const handleSave = async () => {
    if (statement) {
      await statementService.updateStatement({
        id: statement.id,
        text,
      })
      router.push(`/daily?statementId=${statement.id}`)
    }
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
    backgroundColor: colors.charcoal[100],
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    color: colors.text.primary,
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  input: {
    color: colors.text.primary,
    fontSize: 24,
    padding: 20,
    backgroundColor: colors.charcoal[200],
    borderRadius: 10,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.charcoal[200],
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
  },
})
