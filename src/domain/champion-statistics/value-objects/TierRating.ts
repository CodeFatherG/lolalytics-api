/**
 * TierRating value object - Immutable tier classification (S+, S, A, B, C, D, F)
 * Per spec: Value objects must be immutable and self-validating
 */
export class TierRating {
  private static readonly VALID_TIERS = ['S+', 'S', 'A', 'B', 'C', 'D', 'F'] as const;

  private readonly value: typeof TierRating.VALID_TIERS[number];

  private constructor(value: typeof TierRating.VALID_TIERS[number]) {
    this.value = value;
  }

  /**
   * Create a TierRating from a string
   * @param tier - Tier string (S+, S, A, B, C, D, F)
   * @returns TierRating instance
   * @throws Error if tier is invalid
   */
  public static from(tier: string): TierRating {
    const upperTier = tier.toUpperCase().trim();

    if (!TierRating.isValidTier(upperTier)) {
      throw new Error(
        `Invalid tier: "${tier}". Valid tiers: ${TierRating.VALID_TIERS.join(', ')}`
      );
    }

    return new TierRating(upperTier as typeof TierRating.VALID_TIERS[number]);
  }

  /**
   * Check if a string is a valid tier
   */
  private static isValidTier(tier: string): tier is typeof TierRating.VALID_TIERS[number] {
    return (TierRating.VALID_TIERS as readonly string[]).includes(tier);
  }

  /**
   * Get the tier as a string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Get numeric score for comparison (S+ = 7, F = 1)
   */
  public toNumericScore(): number {
    const scores: Record<string, number> = {
      'S+': 7,
      'S': 6,
      'A': 5,
      'B': 4,
      'C': 3,
      'D': 2,
      'F': 1,
    };

    return scores[this.value];
  }

  /**
   * Compare this tier with another
   * @returns Positive if this tier is better, negative if worse, 0 if equal
   */
  public compareTo(other: TierRating): number {
    return this.toNumericScore() - other.toNumericScore();
  }
}
