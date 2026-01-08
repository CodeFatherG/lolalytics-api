import { Champion } from './Champion.js';
import { Winrate } from '../value-objects/Winrate.js';
import { Pickrate } from '../value-objects/Pickrate.js';
import { Banrate } from '../value-objects/Banrate.js';
import { TierRating } from '../value-objects/TierRating.js';

/**
 * ChampionStatistics aggregate root - Contains all performance metrics for a champion
 * Per DDD: Aggregate root enforces invariants and controls access to contained objects
 * Invariant: All statistics must reference a valid champion
 */
export class ChampionStatistics {
  private constructor(
    private readonly champion: Champion,
    private readonly winrate: Winrate,
    private readonly pickrate: Pickrate,
    private readonly banrate: Banrate,
    private readonly tierRating: TierRating,
    private readonly rank: number,
    private readonly gamesPlayed: number,
    private readonly winrateDelta?: string,
    private readonly gameAverageWinrate?: string
  ) {
    // Invariant: rank must be positive
    if (rank < 1) {
      throw new Error(`Rank must be positive, got: ${rank}`);
    }

    // Invariant: games played must be non-negative
    if (gamesPlayed < 0) {
      throw new Error(`Games played must be non-negative, got: ${gamesPlayed}`);
    }
  }

  /**
   * Create a ChampionStatistics aggregate
   */
  public static create(params: {
    champion: Champion;
    winrate: Winrate;
    pickrate: Pickrate;
    banrate: Banrate;
    tierRating: TierRating;
    rank: number;
    gamesPlayed: number;
    winrateDelta?: string;
    gameAverageWinrate?: string;
  }): ChampionStatistics {
    return new ChampionStatistics(
      params.champion,
      params.winrate,
      params.pickrate,
      params.banrate,
      params.tierRating,
      params.rank,
      params.gamesPlayed,
      params.winrateDelta,
      params.gameAverageWinrate
    );
  }

  /**
   * Get the champion entity
   */
  public getChampion(): Champion {
    return this.champion;
  }

  /**
   * Get winrate
   */
  public getWinrate(): Winrate {
    return this.winrate;
  }

  /**
   * Get pickrate
   */
  public getPickrate(): Pickrate {
    return this.pickrate;
  }

  /**
   * Get banrate
   */
  public getBanrate(): Banrate {
    return this.banrate;
  }

  /**
   * Get tier rating
   */
  public getTierRating(): TierRating {
    return this.tierRating;
  }

  /**
   * Get rank position
   */
  public getRank(): number {
    return this.rank;
  }

  /**
   * Get games played
   */
  public getGamesPlayed(): number {
    return this.gamesPlayed;
  }

  /**
   * Get winrate delta (optional)
   */
  public getWinrateDelta(): string | undefined {
    return this.winrateDelta;
  }

  /**
   * Get game average winrate (optional)
   */
  public getGameAverageWinrate(): string | undefined {
    return this.gameAverageWinrate;
  }

  /**
   * Check if this champion is performing well (tier S+ or S)
   */
  public isTopTier(): boolean {
    const score = this.tierRating.toNumericScore();
    return score >= 6; // S+ or S
  }

  /**
   * Get champion performance summary
   */
  public getSummary(): string {
    return `${this.champion.getDisplayName()} (${this.tierRating.toString()}): ` +
           `${this.winrate.toString()} WR, ${this.pickrate.toString()} PR, ` +
           `${this.banrate.toString()} BR - Rank #${this.rank}`;
  }
}
