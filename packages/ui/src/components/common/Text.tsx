import React from 'react'
import { Text as GluestackText, Heading as GluestackHeading } from '@gluestack-ui/themed'
import { tokens } from '../../theme'

export interface TextProps {
  /**
   * The content of the text
   */
  children: React.ReactNode;

  /**
   * The color of the text
   */
  color?: string;

  /**
   * The font weight of the text
   */
  fontWeight?: 'normal' | 'bold' | 'semibold' | 'light';

  /**
   * The font size of the text
   */
  fontSize?: number;

  /**
   * Whether the text is italic
   */
  isItalic?: boolean;

  /**
   * Whether the text is underlined
   */
  isUnderlined?: boolean;

  /**
   * The number of lines to show before truncating
   */
  numberOfLines?: number;

  /**
   * Additional props to pass to the text
   */
  [key: string]: any;
}

/**
 * Text component for displaying text
 */
export const Text: React.FC<TextProps> = ({
  children,
  color,
  fontWeight,
  fontSize,
  isItalic = false,
  isUnderlined = false,
  numberOfLines,
  ...props
}) => {
  return (
    <GluestackText
      color={color}
      fontWeight={fontWeight}
      fontSize={fontSize}
      fontStyle={isItalic ? 'italic' : 'normal'}
      textDecorationLine={isUnderlined ? 'underline' : 'none'}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </GluestackText>
  )
}

export interface HeadingProps {
  /**
   * The content of the heading
   */
  children: React.ReactNode;

  /**
   * The color of the heading
   */
  color?: string;

  /**
   * The font weight of the heading
   */
  fontWeight?: 'normal' | 'bold' | 'semibold' | 'light';

  /**
   * The font size of the heading
   */
  fontSize?: number;

  /**
   * Additional props to pass to the heading
   */
  [key: string]: any;
}

/**
 * Heading component for displaying headings
 */
export const Heading: React.FC<HeadingProps> = ({
  children,
  color,
  fontWeight = 'bold',
  fontSize = 24,
  ...props
}) => {
  return (
    <GluestackHeading
      color={color}
      fontWeight={fontWeight}
      fontSize={fontSize}
      {...props}
    >
      {children}
    </GluestackHeading>
  )
}

/**
 * Title component for displaying titles
 */
export const Title: React.FC<Omit<HeadingProps, 'fontSize' | 'fontWeight'>> = ({
  children,
  ...props
}) => {
  return (
    <Heading fontSize={28} fontWeight="bold" {...props}>
      {children}
    </Heading>
  )
}

/**
 * Subtitle component for displaying subtitles
 */
export const Subtitle: React.FC<Omit<HeadingProps, 'fontSize' | 'fontWeight'>> = ({
  children,
  ...props
}) => {
  return (
    <Heading fontSize={20} fontWeight="semibold" {...props}>
      {children}
    </Heading>
  )
}

/**
 * Caption component for displaying captions
 */
export const Caption: React.FC<Omit<TextProps, 'fontSize'>> = ({
  children,
  ...props
}) => {
  return (
    <Text fontSize={12} color={tokens.colors.gray600} {...props}>
      {children}
    </Text>
  )
}

/**
 * Error text component for displaying error messages
 */
export const ErrorText: React.FC<Omit<TextProps, 'color'>> = ({
  children,
  ...props
}) => {
  return (
    <Text color={tokens.colors.error500} {...props}>
      {children}
    </Text>
  )
}

/**
 * Success text component for displaying success messages
 */
export const SuccessText: React.FC<Omit<TextProps, 'color'>> = ({
  children,
  ...props
}) => {
  return (
    <Text color={tokens.colors.success500} {...props}>
      {children}
    </Text>
  )
}