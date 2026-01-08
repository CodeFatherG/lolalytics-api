/**
 * PerformanceDelta value object - Immutable change measurement with direction and magnitude
 */
export class PerformanceDelta {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Create a PerformanceDelta from a string (e.g., "+2.5%" or "-1.3%")
   * @param deltaStr - Delta string with sign and percentage
   * @returns PerformanceDelta instance
   */
  public static fromString(deltaStr: string): PerformanceDelta {
    return new PerformanceDelta(deltaStr.trim());
  }

  /**
   * Get the raw delta string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Get numerical value (positive or negative)
   */
  public toNumber(): number {
    const cleaned = this.value.replace('%', '').replace('+', '');
    return parseFloat(cleaned) || 0;
  }

  /**
   * Check if this is a buff (positive change)
   */
  public isBuff(): boolean {
    return this.toNumber() > 0;
  }

  /**
   * Check if this is a nerf (negative change)
   */
  public isNerf(): boolean {
    return this.toNumber() < 0;
  }

  /**
   * Check if change is significant (>= 2% absolute)
   */
  public isSignificant(): boolean {
    return Math.abs(this.toNumber()) >= 2.0;
  }
}
