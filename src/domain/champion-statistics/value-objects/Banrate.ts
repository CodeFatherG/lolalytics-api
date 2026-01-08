/**
 * Banrate value object - Immutable percentage value representing ban frequency
 * Per spec: Value objects must be immutable and self-validating
 */
export class Banrate {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Create a Banrate from a percentage value
   * @param percentage - Banrate as percentage (0-100)
   * @returns Banrate instance
   * @throws Error if value is outside valid range
   */
  public static fromPercentage(percentage: number): Banrate {
    if (percentage < 0 || percentage > 100) {
      throw new Error(
        `Banrate must be between 0 and 100, got: ${percentage}`
      );
    }

    return new Banrate(percentage);
  }

  /**
   * Create a Banrate from a string (e.g., "8.5%" or "8.5")
   * @param str - Banrate as string
   * @returns Banrate instance
   * @throws Error if string cannot be parsed or value is invalid
   */
  public static fromString(str: string): Banrate {
    const cleaned = str.replace('%', '').trim();
    const value = parseFloat(cleaned);

    if (isNaN(value)) {
      throw new Error(`Cannot parse banrate from: "${str}"`);
    }

    return Banrate.fromPercentage(value);
  }

  /**
   * Get the banrate as a percentage number
   */
  public toPercentage(): number {
    return this.value;
  }

  /**
   * Get the banrate as a formatted string with % symbol
   */
  public toString(): string {
    return `${this.value}%`;
  }
}
