import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Still</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Reconnect with your North star</Text>
        <Link href="/daily" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start with examples</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/create" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Write your own</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});