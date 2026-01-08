/**
 * CounterEffectiveness value object - Represents how effective a counter is
 * Immutable value object for counter strength classification
 */
export class CounterEffectiveness {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Create CounterEffectiveness from winrate difference
   * @param winrateDifference - Percentage point difference in winrate
   * @returns CounterEffectiveness instance
   */
  public static fromWinrateDifference(winrateDifference: number): CounterEffectiveness {
    return new CounterEffectiveness(winrateDifference);
  }

  /**
   * Get the numerical value
   */
  public getValue(): number {
    return this.value;
  }

  /**
   * Classify counter strength
   */
  public getStrength(): 'hard-counter' | 'soft-counter' | 'even' | 'favorable' | 'very-favorable' {
    if (this.value >= 5.0) {
      return 'hard-counter';
    } else if (this.value >= 2.0) {
      return 'soft-counter';
    } else if (this.value >= -2.0 && this.value < 2.0) {
      return 'even';
    } else if (this.value >= -5.0) {
      return 'favorable';
    } else {
      return 'very-favorable';
    }
  }

  /**
   * Check if this is a hard counter (>= 5% winrate advantage)
   */
  public isHardCounter(): boolean {
    return this.value >= 5.0;
  }

  /**
   * Check if matchup is even
   */
  public isEven(): boolean {
    return Math.abs(this.value) < 2.0;
  }
}
