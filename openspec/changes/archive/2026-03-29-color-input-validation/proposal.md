# Proposal: Color Input Validation

## Why

When users enter an invalid hex color code in Excalidraw's color input field, the input is silently rejected and reverts to the previous valid color on blur. There is no visual or textual feedback explaining why the color didn't change, leading to confusion — especially for users unfamiliar with hex color formats. This change adds inline validation feedback to improve usability (ref: excalidraw/excalidraw#9527).

## What Changes

- Add inline error message display below the hex color input field when an invalid value is entered
- Show contextual error messages (e.g., "Invalid hex color", "Hex must be 3, 4, 6, or 8 characters")
- Clear the error message when the user corrects the input or the field loses focus
- Error state styling (red border / text) on the input field during invalid input

## Capabilities

### New Capabilities
- `color-input-error-feedback`: Inline validation error display for the hex color input field in the ColorPicker component

### Modified Capabilities
<!-- No existing spec-level capabilities are changing -->

## Impact

- **Code**: `packages/excalidraw/components/ColorPicker/ColorInput.tsx` — add error state and message rendering
- **Code**: `packages/excalidraw/components/ColorPicker/ColorPicker.scss` — add error styling
- **Code**: `packages/common/src/colors.ts` — extend `normalizeInputColor` or add a new function to return specific error reasons (not just `null`)
- **Tests**: `packages/excalidraw/tests/colorInput.test.ts` — add tests for error message display and clearing
- **Dependencies**: None — uses existing tinycolor2 validation, just surfaces the result to the user

## Risks

- **Error message clipping in small popover** — The color picker has a fixed-size popover. Mitigation: keep error text to one short line with small font size.
- **Visual clutter on rapid typing** — Error flickers as user types partial values. Mitigation: acceptable trade-off for real-time feedback; clears instantly on valid input.
- **No i18n for error messages** — Strings are English-only. Mitigation: can be migrated to existing `t()` translation system in a follow-up.
