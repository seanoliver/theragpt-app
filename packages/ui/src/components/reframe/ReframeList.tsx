import React, { useState } from 'react'
import { Box, VStack, HStack } from '@gluestack-ui/themed'
import { Reframe, CompactReframeCard } from './ReframeCard'
import {
  Text,
  Input,
  SecondaryButton,
} from '../common'
import { tokens } from '../../theme'

export interface ReframeListProps {
  /**
   * The reframes to display
   */
  reframes: Reframe[];

  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean;

  /**
   * The function to call when a reframe is selected
   */
  onReframeSelect?: (reframeId: string) => void;

  /**
   * The function to call when a reframe is favorited
   */
  onToggleFavorite?: (reframeId: string, isFavorite: boolean) => void;

  /**
   * The function to call when a reframe is deleted
   */
  onDeleteReframe?: (reframeId: string) => void;

  /**
   * The function to call when the filter changes
   */
  onFilterChange?: (filter: ReframeFilter) => void;

  /**
   * Additional props to pass to the container
   */
  [key: string]: any;
}

export interface ReframeFilter {
  /**
   * The search text to filter by
   */
  searchText?: string;

  /**
   * Whether to show only favorites
   */
  favoritesOnly?: boolean;

  /**
   * The tags to filter by
   */
  tags?: string[];
}

/**
 * ReframeList component for displaying a list of reframes
 */
export const ReframeList: React.FC<ReframeListProps> = ({
  reframes,
  isLoading: _isLoading = false,
  onReframeSelect,
  onToggleFavorite,
  onDeleteReframe,
  onFilterChange,
  ...props
}) => {
  // State for filter
  const [filter, setFilter] = useState<ReframeFilter>({
    searchText: '',
    favoritesOnly: false,
    tags: [],
  })

  // Handle search text change
  const handleSearchChange = (text: string) => {
    const newFilter = {
      ...filter,
      searchText: text,
    }

    setFilter(newFilter)

    if (onFilterChange) {
      onFilterChange(newFilter)
    }
  }

  // Handle favorites toggle
  const handleFavoritesToggle = () => {
    const newFilter = {
      ...filter,
      favoritesOnly: !filter.favoritesOnly,
    }

    setFilter(newFilter)

    if (onFilterChange) {
      onFilterChange(newFilter)
    }
  }

  // Get all unique tags from reframes
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>()

    reframes.forEach(reframe => {
      if (reframe.tags) {
        reframe.tags.forEach(tag => tagSet.add(tag))
      }
    })

    return Array.from(tagSet)
  }, [reframes])

  // Toggle tag selection
  const handleTagToggle = (tag: string) => {
    const newTags = filter.tags?.includes(tag)
      ? filter.tags.filter(t => t !== tag)
      : [...(filter.tags || []), tag]

    const newFilter = {
      ...filter,
      tags: newTags,
    }

    setFilter(newFilter)

    if (onFilterChange) {
      onFilterChange(newFilter)
    }
  }

  // Filter reframes based on current filter
  const filteredReframes = React.useMemo(() => {
    return reframes.filter(reframe => {
      // Filter by search text
      if (filter.searchText && !reframe.originalThought.content.toLowerCase().includes(filter.searchText.toLowerCase()) &&
          !reframe.reframe.toLowerCase().includes(filter.searchText.toLowerCase())) {
        return false
      }

      // Filter by favorites
      if (filter.favoritesOnly && !reframe.isFavorite) {
        return false
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        if (!reframe.tags || !filter.tags.some(tag => reframe.tags?.includes(tag))) {
          return false
        }
      }

      return true
    })
  }, [reframes, filter])

  return (
    <Box width="100%" {...props}>
      {/* Filter section */}
      <VStack gap={12} marginBottom={16}>
        <Input
          placeholder="Search reframes..."
          value={filter.searchText}
          onChangeText={handleSearchChange}
        />

        <HStack justifyContent="space-between" alignItems="center">
          <SecondaryButton
            onPress={handleFavoritesToggle}
            backgroundColor={filter.favoritesOnly ? tokens.colors.primary50 : 'transparent'}
            borderColor={filter.favoritesOnly ? tokens.colors.primary500 : tokens.colors.gray300}
          >
            {filter.favoritesOnly ? 'All Reframes' : 'Favorites Only'}
          </SecondaryButton>

          {allTags.length > 0 && (
            <HStack flexWrap="wrap" gap={4}>
              {allTags.map(tag => (
                <Box
                  key={tag}
                  backgroundColor={filter.tags?.includes(tag) ? tokens.colors.primary50 : tokens.colors.gray100}
                  borderColor={filter.tags?.includes(tag) ? tokens.colors.primary500 : tokens.colors.gray300}
                  borderWidth={1}
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={4}
                  onTouchEnd={() => handleTagToggle(tag)}
                >
                  <Text
                    fontSize={12}
                    color={filter.tags?.includes(tag) ? tokens.colors.primary700 : tokens.colors.gray700}
                  >
                    {tag}
                  </Text>
                </Box>
              ))}
            </HStack>
          )}
        </HStack>
      </VStack>

      {/* Reframes list */}
      {filteredReframes.length === 0 ? (
        <Box alignItems="center" justifyContent="center" padding={16}>
          <Text>No reframes found</Text>
        </Box>
      ) : (
        <VStack gap={12}>
          {filteredReframes.map(reframe => (
            <CompactReframeCard
              key={reframe.id}
              reframe={reframe}
              onSelect={onReframeSelect}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDeleteReframe}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}