# Welcome Screen Specification

## Overview
This document specifies the UI/UX requirements for the mobile app welcome screen where users can enter their troubling thoughts.

## UI Components

### 1. Header Component
- Displays the heading text "What's bothering you?" at the top of the screen
- Should be visually prominent and welcoming
- Should maintain consistent styling with the app's theme

### 2. Thought Input Component
- A text entry field positioned in the center of the screen
- Multi-line input to accommodate longer thoughts
- Placeholder text: "Type your thought here..."
- Should expand vertically as user types (up to a maximum height)
- Should have focus when the screen loads

### 3. Submit Button Component
- Positioned below the thought input field
- Default text: "Submit"
- Initially enabled only when text is entered in the thought input field
- Visual feedback on press (animation/color change)

### 4. Locked Thought Display Component
- Displays the submitted thought in a read-only format
- Should visually indicate the thought is locked/uneditable
- Should maintain the same visual space as the input field for consistency

### 5. Additional Context Component
- A secondary text input field that appears after thought submission
- Placeholder text: "Any additional context? (optional)"
- Should be visually distinct from but complementary to the main thought input

### 6. Skip/Submit Context Button Component
- Initially displays as "Skip" when additional context field appears
- Changes to "Submit" if user starts typing in the additional context field
- Should be positioned below the additional context input field

## State Management

### States
```
STATE ThoughtEntryState {
    currentThought: string
    isThoughtSubmitted: boolean
    additionalContext: string
    isAdditionalContextFocused: boolean
}
```

### Initial State
```
INITIAL_STATE = {
    currentThought: "",
    isThoughtSubmitted: false,
    additionalContext: "",
    isAdditionalContextFocused: false
}
```

## User Flow Logic

```
FUNCTION renderWelcomeScreen() {
    RENDER Header("What's bothering you?")

    IF NOT state.isThoughtSubmitted THEN
        RENDER ThoughtInput(
            value: state.currentThought,
            onChange: updateThought,
            placeholder: "Type your thought here..."
        )

        IF state.currentThought.length > 0 THEN
            RENDER SubmitButton(
                text: "Submit",
                onPress: handleThoughtSubmission,
                enabled: true
            )
        ELSE
            RENDER SubmitButton(
                text: "Submit",
                enabled: false
            )
        END IF
    ELSE
        RENDER LockedThoughtDisplay(state.currentThought)

        RENDER AdditionalContextInput(
            value: state.additionalContext,
            onChange: updateAdditionalContext,
            onFocus: handleAdditionalContextFocus,
            placeholder: "Any additional context? (optional)"
        )

        IF state.additionalContext.length > 0 THEN
            RENDER Button(
                text: "Submit",
                onPress: handleAdditionalContextSubmission
            )
        ELSE
            RENDER Button(
                text: "Skip",
                onPress: handleSkip
            )
        END IF
    END IF
}

FUNCTION updateThought(text) {
    SET state.currentThought = text
}

FUNCTION handleThoughtSubmission() {
    SET state.isThoughtSubmitted = true
    // Focus would automatically move to additional context input
}

FUNCTION updateAdditionalContext(text) {
    SET state.additionalContext = text
}

FUNCTION handleAdditionalContextFocus() {
    SET state.isAdditionalContextFocused = true
}

FUNCTION handleAdditionalContextSubmission() {
    // Submit both the thought and additional context
    // Navigate to next screen or process data
}

FUNCTION handleSkip() {
    // Submit just the thought without additional context
    // Navigate to next screen or process data
}
```

## Animations and Transitions

```
FUNCTION animateThoughtSubmission() {
    // Animate the transition from editable input to locked display
    ANIMATE ThoughtInput {
        duration: 300ms,
        easing: "easeInOut",
        from: { opacity: 1 },
        to: { opacity: 0 }
    }

    ANIMATE LockedThoughtDisplay {
        duration: 300ms,
        easing: "easeInOut",
        from: { opacity: 0 },
        to: { opacity: 1 }
    }

    ANIMATE AdditionalContextInput {
        duration: 300ms,
        easing: "easeInOut",
        from: { opacity: 0, translateY: 20 },
        to: { opacity: 1, translateY: 0 }
    }
}
```

## Accessibility Considerations

```
FUNCTION setupAccessibility() {
    SET Header.accessibilityRole = "header"
    SET Header.accessibilityLabel = "What's bothering you?"

    SET ThoughtInput.accessibilityLabel = "Enter your troubling thought"
    SET ThoughtInput.accessibilityHint = "Type the thought that's bothering you and press submit when done"

    SET SubmitButton.accessibilityRole = "button"
    SET SubmitButton.accessibilityLabel = "Submit your thought"

    SET AdditionalContextInput.accessibilityLabel = "Enter additional context"
    SET AdditionalContextInput.accessibilityHint = "Optional field to provide more details about your thought"

    SET SkipButton.accessibilityRole = "button"
    SET SkipButton.accessibilityLabel = "Skip providing additional context"

    // Ensure proper focus order
    SET focusOrder = [ThoughtInput, SubmitButton, AdditionalContextInput, SkipOrSubmitButton]
}
```

## Responsive Design

```
FUNCTION applyResponsiveLayout() {
    // For smaller screens
    IF screenWidth < BREAKPOINT_SMALL THEN
        SET Header.fontSize = FONT_SIZE_LARGE
        SET ThoughtInput.maxHeight = "30% of screen height"
        SET componentSpacing = SPACING_COMPACT

    // For medium screens
    ELSE IF screenWidth < BREAKPOINT_MEDIUM THEN
        SET Header.fontSize = FONT_SIZE_XLARGE
        SET ThoughtInput.maxHeight = "40% of screen height"
        SET componentSpacing = SPACING_NORMAL

    // For larger screens
    ELSE
        SET Header.fontSize = FONT_SIZE_XXLARGE
        SET ThoughtInput.maxHeight = "50% of screen height"
        SET componentSpacing = SPACING_COMFORTABLE
    END IF
}
```

## Test Anchors

```
// Test IDs for component testing
const TEST_IDS = {
    headerComponent: "welcome-screen-header",
    thoughtInputField: "thought-input-field",
    submitThoughtButton: "submit-thought-button",
    lockedThoughtDisplay: "locked-thought-display",
    additionalContextField: "additional-context-field",
    skipContextButton: "skip-context-button",
    submitContextButton: "submit-context-button"
}

// Test scenarios
TEST_SCENARIO: "User submits a thought and skips additional context"
TEST_SCENARIO: "User submits a thought and provides additional context"
TEST_SCENARIO: "User attempts to submit without entering a thought"
TEST_SCENARIO: "User starts typing additional context and button changes from Skip to Submit"
TEST_SCENARIO: "User submits a very long thought that tests the input's vertical expansion"
TEST_SCENARIO: "Screen renders correctly on different device sizes"
TEST_SCENARIO: "Accessibility features work correctly with screen readers"
```

## Implementation Notes

1. Use the app's theme system for consistent styling (colors, typography, spacing)
2. Implement proper keyboard handling for text inputs
3. Consider adding subtle animations for state transitions to enhance UX
4. Ensure all text inputs handle different text lengths gracefully
5. The locked thought display should maintain the same visual weight as the input field
6. Consider adding a subtle visual indicator that the additional context field is optional