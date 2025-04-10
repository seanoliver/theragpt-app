import React, { useEffect, useState } from 'react'
import { Box, ScrollView } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { DetailedReframeCard, Reframe as UIReframe } from '@theragpt/ui/src/components/reframe'
import { reframeService } from '@theragpt/logic/src/reframe/service'
import { Reframe as LogicReframe } from '@theragpt/logic/src/reframe/types'

// TODO: Update the data model to include distortionName in the Reframe type
// so we don't have to do this mapping between different types
const mapToUIReframe = (reframe: LogicReframe): UIReframe => {
  return {
    id: reframe.id,
    originalThought: reframe.originalThought,
    distortionName: 'Cognitive Distortion', // Placeholder until data model is updated
    reframe: reframe.reframe,
    explanation: reframe.explanation,
    createdAt: reframe.createdAt,
    isFavorite: reframe.isFavorite,
    tags: reframe.tags || [],
  }
}

export default function ReframeDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>()
  const [reframe, setReframe] = useState<UIReframe | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadReframe(params.id)
    }
  }, [params.id])

  const loadReframe = async (id: string) => {
    try {
      setIsLoading(true)
      const logicReframe = await reframeService.getReframeById(id)

      if (logicReframe) {
        setReframe(mapToUIReframe(logicReframe))
      } else {
        // Handle not found
        console.error('Reframe not found')
        router.back()
      }
    } catch (error) {
      console.error('Error loading reframe:', error)
      // Handle error (could show an alert or error message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = async (reframeId: string, isFavorite: boolean) => {
    try {
      await reframeService.updateReframe({
        id: reframeId,
        isFavorite,
      })

      // Reload the reframe
      if (params.id) {
        loadReframe(params.id)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Handle error (could show an alert or error message)
    }
  }

  const handleDelete = async (reframeId: string) => {
    try {
      await reframeService.deleteReframe(reframeId)

      // Navigate back
      router.back()
    } catch (error) {
      console.error('Error deleting reframe:', error)
      // Handle error (could show an alert or error message)
    }
  }

  if (!reframe) {
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
          <DetailedReframeCard
            reframe={reframe}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        </ScrollView>
      </Box>
    </SafeAreaView>
  )
}