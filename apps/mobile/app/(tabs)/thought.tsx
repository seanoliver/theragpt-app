import React, { useState } from 'react'
import { Box, ScrollView } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { ThoughtInput } from '@theragpt/ui/src/components/thought'
import { thoughtAnalyzer } from '@theragpt/logic/src/thought/analyzer'
import { NestedThoughtAnalysis } from '@theragpt/logic/src/thought/analyzer'

export default function ThoughtScreen() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (thought: string, context?: string) => {
    try {
      setIsLoading(true)

      // Analyze the thought using the shared logic
      const analysis = await thoughtAnalyzer.analyzeThought(
        thought,
        context
      )

      // Navigate to the analysis screen with the analysis result
      router.push({
        pathname: '/analysis',
        params: {
          analysis: JSON.stringify(analysis),
        },
      })
    } catch (error) {
      console.error('Error analyzing thought:', error)
      // Handle error (could show an alert or error message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="$background.light">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <ThoughtInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </ScrollView>
      </Box>
    </SafeAreaView>
  )
}