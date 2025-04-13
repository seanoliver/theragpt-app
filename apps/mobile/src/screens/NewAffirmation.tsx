import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';

export function NewAffirmationScreen() {
  const [affirmation, setAffirmation] = useState('');

  const handleSave = () => {
    // TODO: Save the affirmation
    router.push('/library');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/library" asChild>
          <TouchableOpacity>
            <Text style={styles.backButton}>← Back to Library</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>New Affirmation</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          value={affirmation}
          onChangeText={setAffirmation}
          placeholder="Enter your affirmation"
          placeholderTextColor="#666"
          multiline
        />

        <TouchableOpacity style={styles.aiButton}>
          <Text style={styles.buttonText}>Ask AI to reword</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    gap: 20,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 18,
    padding: 20,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  aiButton: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});