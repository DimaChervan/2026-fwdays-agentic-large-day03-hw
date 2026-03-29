## ADDED Requirements

### Requirement: Display error message for invalid hex color input
The system SHALL display an inline error message below the hex color input field when the user enters an invalid color value. The error message SHALL be visible immediately as the user types.

#### Scenario: Invalid hex characters entered
- **WHEN** the user types a value containing non-hexadecimal characters (e.g., "zzzzzz", "blue")
- **THEN** the system SHALL display the error message "Invalid hex color"

#### Scenario: Invalid hex length entered
- **WHEN** the user types a hex value with an invalid length (1, 2, 5, or 7 digits)
- **THEN** the system SHALL display the error message "Hex must be 3, 4, 6, or 8 characters"

#### Scenario: Hex value exceeds maximum length
- **WHEN** the user types a hex value with more than 8 characters
- **THEN** the system SHALL display the error message "Hex must be 3, 4, 6, or 8 characters"

### Requirement: Clear error message on valid input
The system SHALL clear the error message as soon as the input contains a valid color value.

#### Scenario: User corrects invalid input to valid hex
- **WHEN** the user has entered an invalid value and then corrects it to a valid hex color (e.g., "ff0000")
- **THEN** the error message SHALL be removed immediately

#### Scenario: User corrects invalid input to valid named color
- **WHEN** the user has entered an invalid value and then types a valid CSS color name (e.g., "red")
- **THEN** the error message SHALL be removed immediately

### Requirement: Clear error message on blur
The system SHALL clear the error message when the hex input field loses focus.

#### Scenario: User leaves the input field with invalid value
- **WHEN** the user has entered an invalid hex value and clicks or tabs away from the input field
- **THEN** the error message SHALL be removed and the input SHALL revert to the last valid color

### Requirement: Visual error styling on input container
The system SHALL apply visual error styling to the hex input container when an error is present.

#### Scenario: Error state applies red border
- **WHEN** an invalid color value is entered and an error message is displayed
- **THEN** the input container SHALL have a red/error border style

#### Scenario: Error state clears with valid input
- **WHEN** the user corrects the input to a valid color
- **THEN** the error border style SHALL be removed

### Requirement: Error message does not block interaction
The error message SHALL not prevent the user from continuing to type, selecting the eye dropper, or interacting with other color picker controls.

#### Scenario: User can continue typing while error is shown
- **WHEN** an error message is displayed
- **THEN** the user SHALL still be able to type in the input field to correct the value

#### Scenario: Eye dropper remains accessible during error
- **WHEN** an error message is displayed
- **THEN** the user SHALL still be able to click the eye dropper tool
