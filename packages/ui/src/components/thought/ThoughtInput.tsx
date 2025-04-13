import React, { useState } from 'react'
import { Box } from '@gluestack-ui/themed'
import { thoughtValidator } from '@northstar/logic/src/thought'
import { MAX_THOUGHT_LENGTH } from '@northstar/config'
import {
  Input,
  PrimaryButton,
  ErrorText,
  Caption,
} from '../common'

export interface ThoughtInputProps {
  /**
   * The initial thought content
   */
  initialThought?: string;

  /**
   * The initial context for the thought
   */
  initialContext?: string;

  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean;

  /**
   * The function to call when the thought is submitted
   */
  onSubmit?: (thought: string, context?: string) => void;

  /**
   * Additional props to pass to the container
   */
  [key: string]: any;
}

/**
 * ThoughtInput component for entering thoughts for analysis
 */
export const ThoughtInput: React.FC<ThoughtInputProps> = ({
  initialThought = '',
  initialContext = '',
  isLoading = false,
  onSubmit,
  ...props
}) => {
  // State for the thought and context
  const [thought, setThought] = useState(initialThought)
  const [context, setContext] = useState(initialContext)
  const [error, setError] = useState<string | null>(null)
  const [characterCount, setCharacterCount] = useState(initialThought.length)

  // Handle thought change
  const handleThoughtChange = (text: string) => {
    setThought(text)
    setCharacterCount(text.length)

    // Clear error when user types
    if (error) {
      setError(null)
    }
  }

  // Handle context change
  const handleContextChange = (text: string) => {
    setContext(text)
  }

  // Handle submit
  const handleSubmit = () => {
    // Validate the thought
    const validationResult = thoughtValidator.validateContent(thought)

    if (!validationResult.valid) {
      setError(validationResult.error || 'Invalid thought')
      return
    }

    // Call the onSubmit callback
    if (onSubmit) {
      onSubmit(thought, context || undefined)
    }
  }

  return (
    <Box width="100%" {...props}>
      <Box marginBottom={16}>
        <Input
          value={thought}
          onChangeText={handleThoughtChange}
          placeholder="Enter your thought here..."
          isDisabled={isLoading}
          isInvalid={!!error}
          multiline={true}
          numberOfLines={4}
        />

        <Box flexDirection="row" justifyContent="space-between" marginTop={4}>
          <Caption>
            {characterCount}/{MAX_THOUGHT_LENGTH} characters
          </Caption>

          {error && <ErrorText>{error}</ErrorText>}
        </Box>
      </Box>

      <Box marginBottom={16}>
        <Input
          label="Context (optional)"
          value={context}
          onChangeText={handleContextChange}
          placeholder="Add any relevant context..."
          helperText="Additional information that might help with analysis"
          isDisabled={isLoading}
        />
      </Box>

      <Box alignItems="flex-end">
        <PrimaryButton
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={isLoading || thought.trim().length === 0}
        >
          Analyze Thought
        </PrimaryButton>
      </Box>
    </Box>
  )
}

/**
 * Simple thought input with just the thought field and submit button
 */
export const SimpleThoughtInput: React.FC<Omit<ThoughtInputProps, 'initialContext'>> = (props) => {
  // Wrap the onSubmit to ignore context
  const handleSubmit = (thought: string) => {
    if (props.onSubmit) {
      props.onSubmit(thought)
    }
  }

  return (
    <Box width="100%" {...props}>
      <Box marginBottom={16}>
        <Input
          value={props.initialThought || ''}
          onChangeText={(_text: string) => {
            // This is just for the UI, actual state is managed in the parent component
          }}
          placeholder="Enter your thought here..."
          multiline={true}
          numberOfLines={3}
          isDisabled={props.isLoading}
        />
      </Box>

      <Box alignItems="flex-end">
        <PrimaryButton
          onPress={() => handleSubmit(props.initialThought || '')}
          isLoading={props.isLoading}
          isDisabled={props.isLoading || !props.initialThought || props.initialThought.trim().length === 0}
        >
          Analyze
        </PrimaryButton>
      </Box>
    </Box>
  )
}