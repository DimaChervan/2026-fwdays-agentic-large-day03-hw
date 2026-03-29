## Context

The `ColorInput` component (`packages/excalidraw/components/ColorPicker/ColorInput.tsx`) uses `normalizeInputColor()` from `@excalidraw/common` to validate hex input. Currently, when validation fails (returns `null`), the `onChange` callback is simply not called, and the input reverts to the last valid color on blur. No error feedback is shown to the user.

The component renders inside a flex container (`color-picker__input-label`) with a `#` prefix, the input field, and an eye dropper button.

## Goals / Non-Goals

**Goals:**
- Show an inline error message when the user enters an invalid hex color
- Provide specific, helpful error text based on the type of validation failure
- Clear the error automatically when the input becomes valid or the field loses focus
- Add visual error styling (red border) to the input container

**Non-Goals:**
- Changing the existing validation logic or supported color formats
- Adding validation to the eye dropper or preset color buttons
- Supporting real-time color preview for partially valid input
- i18n for error messages (can be added later via existing `t()` system)

## Decisions

### 1. Error message placement: below the input container

Display the error message as a small text element below the `color-picker__input-label` div. This requires wrapping the existing container in a parent element or adding the error as a sibling.

**Rationale**: Inline below is the standard pattern for form field errors. A tooltip would require hover/focus management and could be clipped by the picker popover boundaries.

**Alternative considered**: Tooltip on hover — rejected because it requires extra interaction and may not be visible on touch devices.

### 2. Validation error function: new `getColorValidationError()` in `@excalidraw/common`

Create a new function that returns a specific error string (or `null` if valid) rather than modifying `normalizeInputColor()`. The `ColorInput` component calls this on each input change.

**Rationale**: Keeps `normalizeInputColor()` unchanged (it's used elsewhere and its `string | null` return type is sufficient for those callers). A separate function avoids breaking existing consumers.

**Alternative considered**: Extending `normalizeInputColor` to return `{ color, error }` — rejected because it changes the API surface for all callers.

### 3. Error state management: local `useState` in `ColorInput`

Add an `errorMessage` state to `ColorInput`. Set it in `changeColor()` when validation fails; clear it when validation succeeds or on blur.

**Rationale**: The error is purely UI-local — no other component needs to know about it. No need for atoms or context.

### 4. Error styling: CSS class toggle on container

Add an `error` CSS class to the `color-picker__input-label` div when there's an error. Style with red border via `ColorPicker.scss`.

**Rationale**: Follows the existing pattern of class-based styling in the component. Minimal change footprint.

## Risks / Trade-offs

- **[Visual clutter on rapid typing]** → Error message appears/disappears quickly as user types. Mitigation: This is acceptable — the error clears instantly on valid input, providing real-time feedback.
- **[Error message may be clipped in small popover]** → The color picker popover has a fixed size. Mitigation: Keep error text to one short line; use small font size matching existing UI patterns.
- **[No i18n for error messages]** → Error strings will be in English only initially. Mitigation: Use the existing `t()` translation system and add translation keys. This can be done in a follow-up if needed.
