import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { BeginButton } from './BeginButton';
import { colors } from '../../../lib/theme';

export function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Still</Text>
      </View>
      <View style={styles.content}>
        <BeginButton />
        {/* <Link href="/create" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Write your own</Text>
          </TouchableOpacity>
        </Link> */}
      </View>
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
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 32,
    color: colors.text.primary,
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
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.charcoal[200],
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 16,
    textAlign: 'center',
  },
});