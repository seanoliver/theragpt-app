import React, { useEffect, useState } from 'react'
import { Box, ScrollView } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { AnalysisResult } from '@theragpt/ui/src/components/analysis'
import { NestedThoughtAnalysis } from '@theragpt/logic/src/thought/analyzer'
import { thoughtService } from '@theragpt/logic/src/thought/service'
import { reframeService } from '@theragpt/logic/src/reframe/service'

export default function AnalysisScreen() {
  const params = useLocalSearchParams<{ analysis: string }>()
  const [analysis, setAnalysis] = useState<NestedThoughtAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReframes, setSelectedReframes] = useState<Record<string, number>>({})

  useEffect(() => {
    if (params.analysis) {
      try {
        const parsedAnalysis = JSON.parse(params.analysis) as NestedThoughtAnalysis
        setAnalysis(parsedAnalysis)
      } catch (error) {
        console.error('Error parsing analysis:', error)
        // Handle error (could show an alert or error message)
      }
    }
  }, [params.analysis])

  const handleReframeSelect = (distortionId: string, reframeIndex: number) => {
    setSelectedReframes(prev => ({
      ...prev,
      [distortionId]: reframeIndex,
    }))
  }

  const handleSaveReframes = async () => {
    if (!analysis) return

    try {
      setIsLoading(true)

      // Create a thought entry for the original thought
      const thoughtEntry = await thoughtService.createThoughtEntry({
        content: analysis.originalThought.content,
        context: analysis.originalThought.context,
      })

      // Save each selected reframe
      const savedReframePromises = Object.entries(selectedReframes).map(
        async ([distortionId, reframeIndex]) => {
          const distortion = analysis.distortions.find(d => d.id === distortionId)
          if (!distortion) return null

          const reframe = distortion.reframes[reframeIndex]
          if (!reframe) return null

          // Add the distortion to the thought entry
          await thoughtService.addDistortion({
            thoughtId: thoughtEntry.thought.id,
            name: distortion.name,
            explanation: distortion.explanation,
            confidence: distortion.confidence || 0,
          })

          // Save the reframe
          return reframeService.createReframe({
            originalThought: thoughtEntry.thought,
            distortionId,
            reframe: reframe.reframe,
            explanation: reframe.explanation,
          })
        }
      )

      await Promise.all(savedReframePromises)

      // Navigate to the reframes screen
      router.push('/reframes')
    } catch (error) {
      console.error('Error saving reframes:', error)
      // Handle error (could show an alert or error message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!analysis) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} backgroundColor="$background.light" justifyContent="center" alignItems="center">
          {/* Could add a loading indicator or error message here */}
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="$background.light">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <AnalysisResult
            analysis={analysis}
            isLoading={isLoading}
            onReframeSelect={handleReframeSelect}
            onSaveReframes={handleSaveReframes}
          />
        </ScrollView>
      </Box>
    </SafeAreaView>
  )
}