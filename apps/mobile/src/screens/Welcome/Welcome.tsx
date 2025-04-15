import { affirmationService } from '@still/logic/src/affirmation/service'
import { Affirmation } from '@still/logic/src/affirmation/types'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors, tokens } from '../../../lib/theme'
import { StillCard } from '../../shared/StillCard'
import { HelpCallout } from './HelpCallout'
import { SafeAreaView } from 'react-native-safe-area-context'

export function WelcomeScreen() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])
  const [showHelp, setShowHelp] = useState(true)

  useEffect(() => {
    loadAffirmations()
  }, [])

  const loadAffirmations = async () => {
    const activeAffirmations = await affirmationService.getActiveAffirmations()
    setAffirmations(activeAffirmations)
  }

  const handleAffirmationPress = (affirmation: Affirmation) => {
    router.push(`/daily?affirmationId=${affirmation.id}`)
  }

  return (
    <SafeAreaView style={styles.container}>
      {showHelp && <HelpCallout onClose={() => setShowHelp(false)} />}

      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Manifesto</Text>
        <ScrollView style={styles.affirmationsList}>
          {affirmations.map((affirmation, index) => (
            <StillCard
              key={affirmation.id}
              affirmation={affirmation}
              index={index}
              showEdit={false}
              showFavorite={false}
            />
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
  affirmationsList: {
    flex: 1,
    paddingRight: 4,
  },
})
