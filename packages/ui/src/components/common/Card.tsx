import React from 'react'
import { Box, Heading, Text, VStack } from '@gluestack-ui/themed'
import { tokens } from '../../theme'

export interface CardProps {
  /**
   * The content of the card
   */
  children: React.ReactNode

  /**
   * The title of the card
   */
  title?: string

  /**
   * The subtitle of the card
   */
  subtitle?: string

  /**
   * The footer content of the card
   */
  footer?: React.ReactNode

  /**
   * Whether the card has a shadow
   */
  hasShadow?: boolean

  /**
   * Whether the card has a border
   */
  hasBorder?: boolean

  /**
   * Additional props to pass to the card
   */
  [key: string]: any
}

/**
 * Card component for displaying content in a card format
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  hasShadow = true,
  hasBorder = true,
  ...props
}) => {
  return (
    <Box
      backgroundColor="white"
      borderRadius={8}
      padding={16}
      borderWidth={hasBorder ? 1 : 0}
      borderColor={tokens.colors.gray300}
      shadowColor={hasShadow ? tokens.colors.gray500 : 'transparent'}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={hasShadow ? 2 : 0}
      {...props}
    >
      {(title || subtitle) && (
        <VStack marginBottom={12}>
          {title && <Heading>{title}</Heading>}
          {subtitle && <Text color={tokens.colors.gray600}>{subtitle}</Text>}
        </VStack>
      )}

      {children}

      {footer && (
        <Box
          marginTop={12}
          borderTopWidth={1}
          borderTopColor={tokens.colors.gray200}
          paddingTop={12}
        >
          {footer}
        </Box>
      )}
    </Box>
  )
}

/**
 * Simple card with no shadow or border
 */
export const SimpleCard: React.FC<
  Omit<CardProps, 'hasShadow' | 'hasBorder'>
> = ({ children, ...props }) => {
  return (
    <Card hasShadow={false} hasBorder={false} {...props}>
      {children}
    </Card>
  )
}

/**
 * Outlined card with border but no shadow
 */
export const OutlinedCard: React.FC<
  Omit<CardProps, 'hasShadow' | 'hasBorder'>
> = ({ children, ...props }) => {
  return (
    <Card hasShadow={false} hasBorder={true} {...props}>
      {children}
    </Card>
  )
}

/**
 * Elevated card with shadow but no border
 */
export const ElevatedCard: React.FC<
  Omit<CardProps, 'hasShadow' | 'hasBorder'>
> = ({ children, ...props }) => {
  return (
    <Card hasShadow={true} hasBorder={false} {...props}>
      {children}
    </Card>
  )
}

/**
 * Card with a header section
 */
export const CardWithHeader: React.FC<
  CardProps & { headerContent?: React.ReactNode }
> = ({ headerContent, children, ...props }) => {
  return (
    <Card {...props}>
      {headerContent && (
        <Box
          marginBottom={12}
          borderBottomWidth={1}
          borderBottomColor={tokens.colors.gray200}
          paddingBottom={12}
        >
          {headerContent}
        </Box>
      )}
      {children}
    </Card>
  )
}
