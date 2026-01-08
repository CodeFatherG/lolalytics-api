import { Winrate } from '../../champion-statistics/value-objects/Winrate.js';

/**
 * MatchupResult aggregate root - Represents performance between two champions
 * Per DDD: Aggregate root enforces invariants
 * Invariant: champion1 and champion2 must be different
 */
export class MatchupResult {
  private constructor(
    private readonly champion1: string,
    private readonly champion2: string,
    private readonly winrate: Winrate,
    private readonly totalGames: number
  ) {
    // Invariant: Champions must be different
    if (champion1.toLowerCase() === champion2.toLowerCase()) {
      throw new Error('Cannot create matchup between same champion');
    }

    // Invariant: Total games must be non-negative
    if (totalGames < 0) {
      throw new Error(`Total games must be non-negative, got: ${totalGames}`);
    }
  }

  /**
   * Create a MatchupResult
   * @param champion1 - First champion name
   * @param champion2 - Second champion name
   * @param winrate - Winrate from champion1's perspective
   * @param totalGames - Total games played in this matchup
   */
  public static create(
    champion1: string,
    champion2: string,
    winrate: Winrate,
    totalGames: number
  ): MatchupResult {
    return new MatchupResult(
      champion1.toLowerCase().trim(),
      champion2.toLowerCase().trim(),
      winrate,
      totalGames
    );
  }

  /**
   * Get first champion name
   */
  public getChampion1(): string {
    return this.champion1;
  }

  /**
   * Get second champion name
   */
  public getChampion2(): string {
    return this.champion2;
  }

  /**
   * Get winrate (from champion1's perspective)
   */
  public getWinrate(): Winrate {
    return this.winrate;
  }

  /**
   * Get total games
   */
  public getTotalGames(): number {
    return this.totalGames;
  }

  /**
   * Check if this matchup favors champion1
   */
  public favorsChampion1(): boolean {
    return this.winrate.toPercentage() > 50;
  }

  /**
   * Check if this matchup is balanced
   */
  public isBalanced(): boolean {
    const wr = this.winrate.toPercentage();
    return wr >= 48 && wr <= 52;
  }

  /**
   * Get the matchup advantage for champion1
   * @returns Positive if champion1 is favored, negative if champion2 is favored
   */
  public getAdvantage(): number {
    return this.winrate.toPercentage() - 50;
  }

  /**
   * Get summary string
   */
  public getSummary(): string {
    return `${this.champion1} vs ${this.champion2}: ${this.winrate.toString()} (${this.totalGames} games)`;
  }
}
