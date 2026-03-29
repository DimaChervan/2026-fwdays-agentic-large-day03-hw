## 1. Validation Logic

- [x] 1.1 Create `getColorValidationError(value: string): string | null` function in `packages/common/src/colors.ts` that returns a specific error message for invalid input or `null` for valid input
- [x] 1.2 Export `getColorValidationError` from `@excalidraw/common` package entry point
- [x] 1.3 Add unit tests for `getColorValidationError` covering: invalid characters, invalid lengths (1, 2, 5, 7, 9+ digits), valid hex (3, 4, 6, 8 digits), valid named colors, and edge cases (empty string, whitespace)

## 2. ColorInput Component Changes

- [x] 2.1 Add `errorMessage` state to `ColorInput` component
- [x] 2.2 Update `changeColor()` to call `getColorValidationError()` and set the error state when validation fails, clear it when validation succeeds
- [x] 2.3 Clear error state on blur (alongside existing revert behavior)
- [x] 2.4 Render error message element below the input container when `errorMessage` is set
- [x] 2.5 Add `error` CSS class to `color-picker__input-label` div when error is present

## 3. Styling

- [x] 3.1 Add error border style for `.color-picker__input-label.error` in `ColorPicker.scss` (red/error border color)
- [x] 3.2 Add error message text style (small font, red color, positioned below input)

## 4. Testing

- [x] 4.1 Add tests in `packages/excalidraw/tests/colorInput.test.ts` for error message display on invalid input
- [x] 4.2 Add tests for error message clearing on valid input and on blur
- [x] 4.3 Add tests for error styling class toggle
- [x] 4.4 Run `yarn test:update` and `yarn test:typecheck` to verify all tests pass
- [x] 4.5 Run `yarn build` to verify production build passes
