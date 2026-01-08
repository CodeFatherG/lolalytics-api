/**
 * Pickrate value object - Immutable percentage value representing pick frequency
 * Per spec: Value objects must be immutable and self-validating
 */
export class Pickrate {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Create a Pickrate from a percentage value
   * @param percentage - Pickrate as percentage (0-100)
   * @returns Pickrate instance
   * @throws Error if value is outside valid range
   */
  public static fromPercentage(percentage: number): Pickrate {
    if (percentage < 0 || percentage > 100) {
      throw new Error(
        `Pickrate must be between 0 and 100, got: ${percentage}`
      );
    }

    return new Pickrate(percentage);
  }

  /**
   * Create a Pickrate from a string (e.g., "15.2%" or "15.2")
   * @param str - Pickrate as string
   * @returns Pickrate instance
   * @throws Error if string cannot be parsed or value is invalid
   */
  public static fromString(str: string): Pickrate {
    const cleaned = str.replace('%', '').trim();
    const value = parseFloat(cleaned);

    if (isNaN(value)) {
      throw new Error(`Cannot parse pickrate from: "${str}"`);
    }

    return Pickrate.fromPercentage(value);
  }

  /**
   * Get the pickrate as a percentage number
   */
  public toPercentage(): number {
    return this.value;
  }

  /**
   * Get the pickrate as a formatted string with % symbol
   */
  public toString(): string {
    return `${this.value}%`;
  }
}
