import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { Box, VStack } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Title, Text, PrimaryButton } from '@theragpt/ui/src/components/common'
import { CompactReframeCard, Reframe as UIReframe } from '@theragpt/ui/src/components/reframe'
import { reframeService } from '@theragpt/logic/src/reframe/service'
import { ReframeSortOption, Reframe as LogicReframe } from '@theragpt/logic/src/reframe/types'

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

export default function ReframesScreen() {
  const [reframes, setReframes] = useState<UIReframe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReframes()
  }, [])

  const loadReframes = async () => {
    try {
      setIsLoading(true)
      const logicReframes = await reframeService.getReframes(
        {}, // No filters
        ReframeSortOption.CREATED_DESC // Sort by newest first
      )

      // Map logic reframes to UI reframes
      const uiReframes = logicReframes.map(mapToUIReframe)
      setReframes(uiReframes)
    } catch (error) {
      console.error('Error loading reframes:', error)
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

      // Refresh the reframes list
      loadReframes()
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Handle error (could show an alert or error message)
    }
  }

  const handleDelete = async (reframeId: string) => {
    try {
      await reframeService.deleteReframe(reframeId)

      // Refresh the reframes list
      loadReframes()
    } catch (error) {
      console.error('Error deleting reframe:', error)
      // Handle error (could show an alert or error message)
    }
  }

  const handleSelect = (reframeId: string) => {
    router.push({
      pathname: '/reframe-detail',
      params: { id: reframeId },
    })
  }

  const handleNewThought = () => {
    router.push('/thought')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="$background.light">
        <VStack flex={1} padding={20} gap={16}>
          <Title>Saved Reframes</Title>

          {reframes.length === 0 ? (
            <VStack flex={1} justifyContent="center" alignItems="center" gap={16}>
              {isLoading ? (
                <Text>Loading reframes...</Text>
              ) : (
                <>
                  <Text textAlign="center">
                    You don't have any saved reframes yet. Start by analyzing a thought.
                  </Text>
                  <PrimaryButton onPress={handleNewThought}>
                    Analyze a Thought
                  </PrimaryButton>
                </>
              )}
            </VStack>
          ) : (
            <FlatList<UIReframe>
              data={reframes}
              keyExtractor={(item: UIReframe) => item.id}
              renderItem={({ item }: { item: UIReframe }) => (
                <Box marginBottom={12}>
                  <CompactReframeCard
                    reframe={item}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                    onSelect={handleSelect}
                  />
                </Box>
              )}
            />
          )}
        </VStack>
      </Box>
    </SafeAreaView>
  )
}