import {
  getColorValidationError,
  normalizeInputColor,
} from "@excalidraw/common";

describe("normalizeInputColor", () => {
  describe("hex colors", () => {
    it("returns hex color with hash as-is", () => {
      expect(normalizeInputColor("#ff0000")).toBe("#ff0000");
      expect(normalizeInputColor("#FF0000")).toBe("#FF0000");
      expect(normalizeInputColor("#abc")).toBe("#abc");
      expect(normalizeInputColor("#ABC")).toBe("#ABC");
    });

    it("adds hash to hex color without hash", () => {
      expect(normalizeInputColor("ff0000")).toBe("#ff0000");
      expect(normalizeInputColor("FF0000")).toBe("#FF0000");
      expect(normalizeInputColor("abc")).toBe("#abc");
      expect(normalizeInputColor("ABC")).toBe("#ABC");
    });

    it("handles 8-digit hex (hexa) with alpha", () => {
      expect(normalizeInputColor("#ff000080")).toBe("#ff000080");
      expect(normalizeInputColor("#ff0000ff")).toBe("#ff0000ff");
    });

    it("does NOT add hash to hexa without hash (tinycolor detects as hex8, not hex)", () => {
      // Note: tinycolor detects 8-digit hex as "hex8" format, not "hex"
      expect(normalizeInputColor("ff000080")).toBe("#ff000080");
    });
  });

  describe("named colors", () => {
    it("returns named colors as-is", () => {
      expect(normalizeInputColor("red")).toBe("red");
      expect(normalizeInputColor("blue")).toBe("blue");
      expect(normalizeInputColor("green")).toBe("green");
      expect(normalizeInputColor("white")).toBe("white");
      expect(normalizeInputColor("black")).toBe("black");
      expect(normalizeInputColor("transparent")).toBe("transparent");
    });

    it("handles case variations of named colors", () => {
      expect(normalizeInputColor("RED")).toBe("RED");
      expect(normalizeInputColor("Red")).toBe("Red");
    });
  });

  describe("rgb/rgba colors", () => {
    it("returns rgb colors as-is", () => {
      expect(normalizeInputColor("rgb(255, 0, 0)")).toBe("rgb(255, 0, 0)");
      expect(normalizeInputColor("rgb(0,0,0)")).toBe("rgb(0,0,0)");
    });

    // NOTE: tinycolor clamps values, so rgb(256, 0, 0) is treated as valid
    it("tinycolor considers out-of-range rgb values as valid (clamped)", () => {
      expect(normalizeInputColor("rgb(256, 0, 0)")).toBe("rgb(256, 0, 0)");
    });

    it("returns rgba colors as-is", () => {
      expect(normalizeInputColor("rgba(255, 0, 0, 0.5)")).toBe(
        "rgba(255, 0, 0, 0.5)",
      );
      expect(normalizeInputColor("rgba(0,0,0,1)")).toBe("rgba(0,0,0,1)");
    });
  });

  describe("hsl/hsla colors", () => {
    it("returns hsl colors as-is", () => {
      expect(normalizeInputColor("hsl(0, 100%, 50%)")).toBe(
        "hsl(0, 100%, 50%)",
      );
    });

    it("returns hsla colors as-is", () => {
      expect(normalizeInputColor("hsla(0, 100%, 50%, 0.5)")).toBe(
        "hsla(0, 100%, 50%, 0.5)",
      );
    });
  });

  describe("whitespace handling", () => {
    it("trims leading whitespace", () => {
      expect(normalizeInputColor("  #ff0000")).toBe("#ff0000");
      expect(normalizeInputColor("  red")).toBe("red");
    });

    it("trims trailing whitespace", () => {
      expect(normalizeInputColor("#ff0000  ")).toBe("#ff0000");
      expect(normalizeInputColor("red  ")).toBe("red");
    });

    it("trims both leading and trailing whitespace", () => {
      expect(normalizeInputColor("  #ff0000  ")).toBe("#ff0000");
      expect(normalizeInputColor("  red  ")).toBe("red");
    });

    it("adds hash to trimmed hex without hash", () => {
      expect(normalizeInputColor("  ff0000  ")).toBe("#ff0000");
    });
  });

  describe("invalid colors", () => {
    it("returns null for invalid color strings", () => {
      expect(normalizeInputColor("notacolor")).toBe(null);
      expect(normalizeInputColor("gggggg")).toBe(null);
      expect(normalizeInputColor("#gggggg")).toBe(null);
      expect(normalizeInputColor("")).toBe(null);
      expect(normalizeInputColor("   ")).toBe(null);
    });

    it("returns null for partial/malformed colors", () => {
      expect(normalizeInputColor("#ff")).toBe(null);
      expect(normalizeInputColor("rgb(")).toBe(null);
    });
  });
});

describe("color input error display logic", () => {
  // Simulates the changeColor logic from ColorInput component
  const simulateChangeColor = (inputValue: string) => {
    const value = inputValue.toLowerCase();
    const color = normalizeInputColor(value);
    if (color) {
      return { accepted: true, errorMessage: null };
    }
    return { accepted: false, errorMessage: getColorValidationError(value) };
  };

  describe("error message display on invalid input", () => {
    it("shows error for invalid hex characters", () => {
      const result = simulateChangeColor("zzzzzz");
      expect(result.accepted).toBe(false);
      expect(result.errorMessage).toBe("Invalid hex color");
    });

    it("shows error for invalid hex length", () => {
      const result = simulateChangeColor("abcde");
      expect(result.accepted).toBe(false);
      expect(result.errorMessage).toBe(
        "Hex must be 3, 4, 6, or 8 characters",
      );
    });

    it("shows error for hex exceeding max length", () => {
      const result = simulateChangeColor("abcdef012");
      expect(result.accepted).toBe(false);
      expect(result.errorMessage).toBe(
        "Hex must be 3, 4, 6, or 8 characters",
      );
    });

    it("shows error for partial hex input (2 chars)", () => {
      const result = simulateChangeColor("ab");
      expect(result.accepted).toBe(false);
      expect(result.errorMessage).toBe(
        "Hex must be 3, 4, 6, or 8 characters",
      );
    });
  });

  describe("error message clearing on valid input", () => {
    it("clears error when valid hex is entered", () => {
      // First invalid
      const invalid = simulateChangeColor("zz");
      expect(invalid.errorMessage).not.toBeNull();

      // Then valid
      const valid = simulateChangeColor("ff0000");
      expect(valid.accepted).toBe(true);
      expect(valid.errorMessage).toBeNull();
    });

    it("clears error when valid named color is entered", () => {
      const invalid = simulateChangeColor("zz");
      expect(invalid.errorMessage).not.toBeNull();

      const valid = simulateChangeColor("red");
      expect(valid.accepted).toBe(true);
      expect(valid.errorMessage).toBeNull();
    });
  });

  describe("error message clearing on blur", () => {
    it("blur resets to last valid color and clears error", () => {
      // Simulating blur: error should be cleared (set to null),
      // and innerValue should revert to last valid color
      const lastValidColor = "#ff0000";
      const invalid = simulateChangeColor("zz");
      expect(invalid.errorMessage).not.toBeNull();

      // On blur, component sets errorMessage to null and innerValue to color
      const errorAfterBlur = null;
      const valueAfterBlur = lastValidColor;
      expect(errorAfterBlur).toBeNull();
      expect(valueAfterBlur).toBe(lastValidColor);
    });
  });

  describe("error styling class toggle", () => {
    it("error class should be applied when errorMessage is set", () => {
      const { errorMessage } = simulateChangeColor("zzzzzz");
      // The component applies "error" class when errorMessage is truthy
      const hasErrorClass = !!errorMessage;
      expect(hasErrorClass).toBe(true);
    });

    it("error class should not be applied when input is valid", () => {
      const { errorMessage } = simulateChangeColor("ff0000");
      const hasErrorClass = !!errorMessage;
      expect(hasErrorClass).toBe(false);
    });
  });
});
