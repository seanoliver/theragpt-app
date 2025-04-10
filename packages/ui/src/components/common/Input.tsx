import React from 'react'
import {
  Input as GluestackInput,
  InputField,
  InputIcon,
  InputSlot,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
} from '@gluestack-ui/themed'

export interface InputProps {
  /**
   * The value of the input
   */
  value?: string;

  /**
   * The placeholder text
   */
  placeholder?: string;

  /**
   * The function to call when the input changes
   */
  onChangeText?: (text: string) => void;

  /**
   * The label for the input
   */
  label?: string;

  /**
   * The helper text to display below the input
   */
  helperText?: string;

  /**
   * The error message to display
   */
  errorMessage?: string;

  /**
   * Whether the input is disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the input is required
   */
  isRequired?: boolean;

  /**
   * Whether the input is invalid
   */
  isInvalid?: boolean;

  /**
   * The icon to display at the start of the input
   */
  leftIcon?: React.ReactNode;

  /**
   * The icon to display at the end of the input
   */
  rightIcon?: React.ReactNode;

  /**
   * Additional props to pass to the input
   */
  [key: string]: any;
}

/**
 * Input component for text input
 */
export const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  onChangeText,
  label,
  helperText,
  errorMessage,
  isDisabled = false,
  isRequired = false,
  isInvalid = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <FormControl
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={isInvalid || !!errorMessage}
    >
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}

      <GluestackInput>
        {leftIcon && (
          <InputSlot>
            <InputIcon>{leftIcon}</InputIcon>
          </InputSlot>
        )}

        <InputField
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          {...props}
        />

        {rightIcon && (
          <InputSlot>
            <InputIcon>{rightIcon}</InputIcon>
          </InputSlot>
        )}
      </GluestackInput>

      {helperText && !errorMessage && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}

      {errorMessage && (
        <FormControlError>
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  )
}

/**
 * Text input for single-line text
 */
export const TextInput: React.FC<InputProps> = (props) => {
  return <Input {...props} />
}

/**
 * Password input with masked text
 */
export const PasswordInput: React.FC<InputProps> = (props) => {
  return <Input secureTextEntry {...props} />
}

/**
 * Email input with email keyboard
 */
export const EmailInput: React.FC<InputProps> = (props) => {
  return <Input keyboardType="email-address" autoCapitalize="none" {...props} />
}

/**
 * Number input with number keyboard
 */
export const NumberInput: React.FC<InputProps> = (props) => {
  return <Input keyboardType="numeric" {...props} />
}