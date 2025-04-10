import React from 'react'
import { Button as GluestackButton, ButtonText } from '@gluestack-ui/themed'
import { tokens } from '../../theme'

export interface ButtonProps {
  /**
   * The content of the button
   */
  children: React.ReactNode

  /**
   * The action to perform when the button is pressed
   */
  onPress?: () => void

  /**
   * Whether the button is disabled
   */
  isDisabled?: boolean

  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean

  /**
   * Additional props to pass to the button
   */
  [key: string]: unknown
}

/**
 * Button component for user interactions
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  isDisabled = false,
  isLoading = false,
  ...props
}) => {
  return (
    <GluestackButton
      onPress={onPress}
      disabled={isDisabled || isLoading}
      {...props}
    >
      <ButtonText>{children}</ButtonText>
    </GluestackButton>
  )
}

/**
 * Primary button with the primary color
 */
export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button backgroundColor={tokens.colors.primary500} {...props}>
      {children}
    </Button>
  )
}

/**
 * Secondary button with an outline style
 */
export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button
      backgroundColor="transparent"
      borderWidth={1}
      borderColor={tokens.colors.primary500}
      {...props}
    >
      <ButtonText color={tokens.colors.primary500}>{children}</ButtonText>
    </Button>
  )
}

/**
 * Link button that looks like a link
 */
export const LinkButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button backgroundColor="transparent" {...props}>
      <ButtonText
        color={tokens.colors.primary500}
        textDecorationLine="underline"
      >
        {children}
      </ButtonText>
    </Button>
  )
}

/**
 * Danger button for destructive actions
 */
export const DangerButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button backgroundColor={tokens.colors.error500} {...props}>
      {children}
    </Button>
  )
}

/**
 * Success button for positive actions
 */
export const SuccessButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button backgroundColor={tokens.colors.success500} {...props}>
      {children}
    </Button>
  )
}
