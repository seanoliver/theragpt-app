import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ManifestoScreen } from '../src/screens/Manifesto/Manifesto'
import { ONBOARDING_KEY } from '../src/screens/Onboarding/constants'

export default function Page() {
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null,
  )

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then(value => {
      if (value === 'true') setOnboardingComplete(true)
      else router.replace('/onboarding')
    })
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ManifestoScreen />
    </GestureHandlerRootView>
  )
}
