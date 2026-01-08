import { TierRating } from '../../champion-statistics/value-objects/TierRating.js';
import { Winrate } from '../../champion-statistics/value-objects/Winrate.js';

/**
 * TierListEntry entity - Represents a champion's position in meta rankings
 * Entity within TierList aggregate
 */
export class TierListEntry {
  private constructor(
    private readonly rank: number,
    private readonly championName: string,
    private readonly tier: TierRating,
    private readonly winrate: Winrate
  ) {
    if (rank < 1) {
      throw new Error(`Rank must be positive, got: ${rank}`);
    }
  }

  /**
   * Create a TierListEntry
   */
  public static create(
    rank: number,
    championName: string,
    tier: TierRating,
    winrate: Winrate
  ): TierListEntry {
    return new TierListEntry(rank, championName, tier, winrate);
  }

  /**
   * Get rank position
   */
  public getRank(): number {
    return this.rank;
  }

  /**
   * Get champion name
   */
  public getChampionName(): string {
    return this.championName;
  }

  /**
   * Get tier rating
   */
  public getTier(): TierRating {
    return this.tier;
  }

  /**
   * Get winrate
   */
  public getWinrate(): Winrate {
    return this.winrate;
  }

  /**
   * Check if this entry is top tier (S+ or S)
   */
  public isTopTier(): boolean {
    return this.tier.toNumericScore() >= 6;
  }

  /**
   * Get display summary
   */
  public getSummary(): string {
    return `#${this.rank} ${this.championName} (${this.tier.toString()}) - ${this.winrate.toString()}`;
  }
}
