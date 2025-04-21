import { Link, router } from 'expo-router'
import { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import theme from '../../lib/theme'
import { useStatementService } from '../hooks/useStatementService'

export function NewStatementScreen() {
  const [text, setText] = useState('')
  const { service, statements } = useStatementService()

  const handleSave = async () => {
    if (text.trim() && service) {
      const statement = await service.create({
        text: text.trim(),
      })
      router.push(`/daily?statementId=${statement.id}`)
    }
  }

  if (!service || !statements) {
    return (
      <View style={styles.container}>
        <Text style={styles.buttonText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/library" asChild>
          <TouchableOpacity>
            <Text style={styles.backButton}>← Back to Library</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>New Statement</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter your statement"
          placeholderTextColor="#666"
          multiline
        />

        <TouchableOpacity style={styles.aiButton}>
          <Text style={styles.buttonText}>Ask AI to reword</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, !text.trim() && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!text.trim()}
      >
        <Text style={styles.buttonText}>Save</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: theme.colors.textOnBackground,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  input: {
    color: theme.colors.textOnBackground,
    fontSize: 18,
    padding: 20,
    backgroundColor: theme.colors.hoverBackground,
    borderRadius: 10,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  aiButton: {
    backgroundColor: theme.colors.hoverBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: theme.colors.hoverBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: theme.colors.textOnBackground,
    fontSize: 16,
  },
})
