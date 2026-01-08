/**
 * Winrate value object - Immutable percentage value (0-100%)
 * Per spec: Value objects must be immutable and self-validating
 */
export class Winrate {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Create a Winrate from a percentage value
   * @param percentage - Winrate as percentage (0-100)
   * @returns Winrate instance
   * @throws Error if value is outside valid range
   */
  public static fromPercentage(percentage: number): Winrate {
    if (percentage < 0 || percentage > 100) {
      throw new Error(
        `Winrate must be between 0 and 100, got: ${percentage}`
      );
    }

    return new Winrate(percentage);
  }

  /**
   * Create a Winrate from a string (e.g., "52.5%" or "52.5")
   * @param str - Winrate as string
   * @returns Winrate instance
   * @throws Error if string cannot be parsed or value is invalid
   */
  public static fromString(str: string): Winrate {
    // Remove '%' if present and trim whitespace
    const cleaned = str.replace('%', '').trim();
    const value = parseFloat(cleaned);

    if (isNaN(value)) {
      throw new Error(`Cannot parse winrate from: "${str}"`);
    }

    return Winrate.fromPercentage(value);
  }

  /**
   * Get the winrate as a percentage number
   */
  public toPercentage(): number {
    return this.value;
  }

  /**
   * Get the winrate as a formatted string with % symbol
   */
  public toString(): string {
    return `${this.value}%`;
  }

  /**
   * Get the winrate as a decimal (0.0-1.0)
   */
  public toDecimal(): number {
    return this.value / 100;
  }
}
