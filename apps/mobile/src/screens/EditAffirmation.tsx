import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { colors } from '../../lib/theme';

export function EditAffirmationScreen() {
  const [affirmation, setAffirmation] = useState('I am worthy of love and respect');

  const handleSave = () => {
    // TODO: Save the affirmation
    router.push('/daily');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/daily" asChild>
          <TouchableOpacity>
            <Text style={styles.backButton}>← Edit Affirmation</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          value={affirmation}
          onChangeText={setAffirmation}
          multiline
          placeholder="Enter your affirmation"
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
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
});