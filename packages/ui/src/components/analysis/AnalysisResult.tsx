import React, { useState } from 'react'
import { Box, VStack, HStack } from '@gluestack-ui/themed'
import {
  NestedThoughtAnalysis,
  DistortionWithReframes,
} from '@theragpt/logic/src/thought/analyzer'
import {
  Card,
  Text,
  Heading,
  Title,
  Subtitle,
  Caption,
  PrimaryButton,
  SecondaryButton,
} from '../common'
import { tokens } from '../../theme'

export interface AnalysisResultProps {
  /**
   * The analysis result to display
   */
  analysis: NestedThoughtAnalysis

  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean

  /**
   * The function to call when a reframe is selected
   */
  onReframeSelect?: (distortionId: string, reframeIndex: number) => void

  /**
   * The function to call when all selected reframes are saved
   */
  onSaveReframes?: () => void

  /**
   * Additional props to pass to the container
   */
  [key: string]: unknown
}

/**
 * AnalysisResult component for displaying thought analysis results
 */
export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  isLoading = false,
  onReframeSelect,
  onSaveReframes,
  ...props
}) => {
  // State for selected reframes
  const [selectedReframes, setSelectedReframes] = useState<
    Record<string, number>
  >({})

  // Handle reframe selection
  const handleReframeSelect = (distortionId: string, reframeIndex: number) => {
    setSelectedReframes(prev => ({
      ...prev,
      [distortionId]: reframeIndex,
    }))

    if (onReframeSelect) {
      onReframeSelect(distortionId, reframeIndex)
    }
  }

  // Handle save reframes
  const handleSaveReframes = () => {
    if (onSaveReframes) {
      onSaveReframes()
    }
  }

  // Check if any reframes are selected
  const hasSelectedReframes = Object.keys(selectedReframes).length > 0

  return (
    <Box width="100%" {...props}>
      <VStack gap={16}>
        {/* Original thought */}
        <Card>
          <VStack gap={8}>
            <Subtitle>Original Thought</Subtitle>
            <Text>{analysis.originalThought.content}</Text>

            {analysis.originalThought.context && (
              <Box marginTop={8}>
                <Caption>Context</Caption>
                <Text>{analysis.originalThought.context}</Text>
              </Box>
            )}
          </VStack>
        </Card>

        {/* General explanation */}
        {analysis.explanation && (
          <Card>
            <VStack gap={8}>
              <Subtitle>Analysis</Subtitle>
              <Text>{analysis.explanation}</Text>
            </VStack>
          </Card>
        )}

        {/* Distortions */}
        <Title>Identified Cognitive Distortions</Title>

        {analysis.distortions.length === 0 ? (
          <Card>
            <Text>
              No cognitive distortions were identified in your thought.
            </Text>
          </Card>
        ) : (
          analysis.distortions.map((distortion, _index) => (
            <DistortionCard
              key={distortion.id}
              distortion={distortion}
              selectedReframeIndex={selectedReframes[distortion.id]}
              onReframeSelect={reframeIndex =>
                handleReframeSelect(distortion.id, reframeIndex)
              }
              isDisabled={isLoading}
            />
          ))
        )}

        {/* Save button */}
        {hasSelectedReframes && (
          <Box alignItems="flex-end" marginTop={16}>
            <PrimaryButton
              onPress={handleSaveReframes}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Save Selected Reframes
            </PrimaryButton>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

interface DistortionCardProps {
  /**
   * The distortion to display
   */
  distortion: DistortionWithReframes

  /**
   * The index of the selected reframe
   */
  selectedReframeIndex?: number

  /**
   * The function to call when a reframe is selected
   */
  onReframeSelect?: (reframeIndex: number) => void

  /**
   * Whether the component is disabled
   */
  isDisabled?: boolean
}

/**
 * DistortionCard component for displaying a cognitive distortion
 */
const DistortionCard: React.FC<DistortionCardProps> = ({
  distortion,
  selectedReframeIndex,
  onReframeSelect,
  isDisabled = false,
}) => {
  // Format confidence as percentage
  const confidencePercent = Math.round((distortion.confidence || 0) * 100)

  return (
    <Card>
      <VStack gap={12}>
        {/* Distortion header */}
        <HStack justifyContent="space-between" alignItems="center">
          <Heading>{distortion.name}</Heading>
          <Box
            backgroundColor={getConfidenceColor(distortion.confidence || 0)}
            paddingHorizontal={8}
            paddingVertical={4}
            borderRadius={4}
          >
            <Text color="white" fontWeight="bold">
              {confidencePercent}% Confidence
            </Text>
          </Box>
        </HStack>

        {/* Distortion explanation */}
        <Text>{distortion.explanation}</Text>

        {/* Reframes */}
        {distortion.reframes.length > 0 && (
          <Box marginTop={8}>
            <Subtitle>Suggested Reframes</Subtitle>
            <VStack gap={8} marginTop={8}>
              {distortion.reframes.map((reframe, index) => (
                <Box
                  key={index}
                  backgroundColor={
                    selectedReframeIndex === index
                      ? tokens.colors.primary50
                      : 'transparent'
                  }
                  borderWidth={1}
                  borderColor={
                    selectedReframeIndex === index
                      ? tokens.colors.primary500
                      : tokens.colors.gray300
                  }
                  borderRadius={8}
                  padding={12}
                >
                  <VStack gap={8}>
                    <Text
                      fontWeight={
                        selectedReframeIndex === index ? 'bold' : 'normal'
                      }
                    >
                      {reframe.reframe}
                    </Text>
                    <Text color={tokens.colors.gray600} fontSize={14}>
                      {reframe.explanation}
                    </Text>
                    {onReframeSelect && (
                      <Box alignItems="flex-end">
                        <SecondaryButton
                          onPress={() => onReframeSelect(index)}
                          isDisabled={isDisabled}
                        >
                          {selectedReframeIndex === index
                            ? 'Selected'
                            : 'Select'}
                        </SecondaryButton>
                      </Box>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Card>
  )
}

/**
 * Get color based on confidence level
 */
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) {
    return tokens.colors.error500
  } else if (confidence >= 0.5) {
    return tokens.colors.warning500
  } else {
    return tokens.colors.success500
  }
}

/**
 * Simple analysis result component without reframe selection
 */
type SimpleAnalysisResultProps = {
  analysis: NestedThoughtAnalysis
  isLoading?: boolean
  [key: string]: unknown
}

export const SimpleAnalysisResult: React.FC<SimpleAnalysisResultProps> = ({
  analysis,
  ...props
}) => {
  return (
    <Box width="100%" {...props}>
      <VStack gap={16}>
        {/* Original thought */}
        <Card>
          <VStack gap={8}>
            <Subtitle>Original Thought</Subtitle>
            <Text>{analysis.originalThought.content}</Text>
          </VStack>
        </Card>

        {/* General explanation */}
        {analysis.explanation && (
          <Card>
            <VStack gap={8}>
              <Subtitle>Analysis</Subtitle>
              <Text>{analysis.explanation}</Text>
            </VStack>
          </Card>
        )}

        {/* Distortions */}
        <Title>Identified Cognitive Distortions</Title>

        {analysis.distortions.length === 0 ? (
          <Card>
            <Text>
              No cognitive distortions were identified in your thought.
            </Text>
          </Card>
        ) : (
          analysis.distortions.map((distortion: DistortionWithReframes) => (
            <Card key={distortion.id}>
              <VStack gap={12}>
                {/* Distortion header */}
                <HStack justifyContent="space-between" alignItems="center">
                  <Heading>{distortion.name}</Heading>
                  <Box
                    backgroundColor={getConfidenceColor(
                      distortion.confidence || 0,
                    )}
                    paddingHorizontal={8}
                    paddingVertical={4}
                    borderRadius={4}
                  >
                    <Text color="white" fontWeight="bold">
                      {Math.round((distortion.confidence || 0) * 100)}%
                      Confidence
                    </Text>
                  </Box>
                </HStack>

                {/* Distortion explanation */}
                <Text>{distortion.explanation}</Text>

                {/* Reframes */}
                {distortion.reframes.length > 0 && (
                  <Box marginTop={8}>
                    <Subtitle>Suggested Reframes</Subtitle>
                    <VStack gap={8} marginTop={8}>
                      {distortion.reframes.map(
                        (
                          reframe: { reframe: string; explanation: string },
                          index: number,
                        ) => (
                          <Box
                            key={index}
                            borderWidth={1}
                            borderColor={tokens.colors.gray300}
                            borderRadius={8}
                            padding={12}
                          >
                            <VStack gap={8}>
                              <Text>{reframe.reframe}</Text>
                              <Text color={tokens.colors.gray600} fontSize={14}>
                                {reframe.explanation}
                              </Text>
                            </VStack>
                          </Box>
                        ),
                      )}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Card>
          ))
        )}
      </VStack>
    </Box>
  )
}
