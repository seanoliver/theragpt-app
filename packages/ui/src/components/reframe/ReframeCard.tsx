import React from 'react'
import { Box, VStack, HStack } from '@gluestack-ui/themed'
import { Thought } from '@northstar/logic/src/thought/types'
import {
  Card,
  Text,
  Subtitle,
  Caption,
  SecondaryButton,
} from '../common'
import { tokens } from '../../theme'

export interface Reframe {
  id: string;
  originalThought: Thought;
  distortionName: string;
  reframe: string;
  explanation: string;
  createdAt: number;
  isFavorite?: boolean;
  tags?: string[];
}

export interface ReframeCardProps {
  /**
   * The reframe to display
   */
  reframe: Reframe;

  /**
   * Whether to show the full details
   */
  showDetails?: boolean;

  /**
   * The function to call when the reframe is favorited
   */
  onToggleFavorite?: (reframeId: string, isFavorite: boolean) => void;

  /**
   * The function to call when the reframe is deleted
   */
  onDelete?: (reframeId: string) => void;

  /**
   * The function to call when the reframe is selected for viewing
   */
  onSelect?: (reframeId: string) => void;

  /**
   * Additional props to pass to the container
   */
  [key: string]: any;
}

/**
 * ReframeCard component for displaying a saved reframe
 */
export const ReframeCard: React.FC<ReframeCardProps> = ({
  reframe,
  showDetails = false,
  onToggleFavorite,
  onDelete,
  onSelect,
  ...props
}) => {
  // Format date
  const formattedDate = new Date(reframe.createdAt).toLocaleDateString()

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(reframe.id, !reframe.isFavorite)
    }
  }

  // Handle delete
  const handleDelete = () => {
    if (onDelete) {
      onDelete(reframe.id)
    }
  }

  // Handle select
  const handleSelect = () => {
    if (onSelect) {
      onSelect(reframe.id)
    }
  }

  return (
    <Card {...props}>
      <VStack gap={8}>
        {/* Header with distortion name and date */}
        <HStack justifyContent="space-between" alignItems="center">
          <Subtitle>{reframe.distortionName}</Subtitle>
          <Caption>{formattedDate}</Caption>
        </HStack>

        {/* Original thought (truncated if not showing details) */}
        <Box>
          <Caption>Original Thought</Caption>
          <Text numberOfLines={showDetails ? undefined : 2}>
            {reframe.originalThought.content}
          </Text>
        </Box>

        {/* Reframe */}
        <Box marginTop={4}>
          <Caption>Reframe</Caption>
          <Text fontWeight="bold">{reframe.reframe}</Text>
        </Box>

        {/* Explanation (only shown if showDetails is true) */}
        {showDetails && (
          <Box marginTop={4}>
            <Caption>Explanation</Caption>
            <Text>{reframe.explanation}</Text>
          </Box>
        )}

        {/* Tags (if any) */}
        {reframe.tags && reframe.tags.length > 0 && (
          <HStack flexWrap="wrap" gap={4} marginTop={4}>
            {reframe.tags.map((tag, index) => (
              <Box
                key={index}
                backgroundColor={tokens.colors.gray100}
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={4}
              >
                <Text fontSize={12}>{tag}</Text>
              </Box>
            ))}
          </HStack>
        )}

        {/* Actions */}
        <HStack justifyContent="flex-end" gap={8} marginTop={8}>
          {onToggleFavorite && (
            <SecondaryButton onPress={handleToggleFavorite}>
              {reframe.isFavorite ? 'Unfavorite' : 'Favorite'}
            </SecondaryButton>
          )}

          {!showDetails && onSelect && (
            <SecondaryButton onPress={handleSelect}>
              View Details
            </SecondaryButton>
          )}

          {onDelete && (
            <SecondaryButton onPress={handleDelete}>
              Delete
            </SecondaryButton>
          )}
        </HStack>
      </VStack>
    </Card>
  )
}

/**
 * Compact reframe card for list views
 */
export const CompactReframeCard: React.FC<ReframeCardProps> = (props) => {
  return <ReframeCard showDetails={false} {...props} />
}

/**
 * Detailed reframe card for detailed views
 */
export const DetailedReframeCard: React.FC<ReframeCardProps> = (props) => {
  return <ReframeCard showDetails={true} {...props} />
}