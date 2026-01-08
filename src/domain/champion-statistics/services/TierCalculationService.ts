import { TierRating } from '../value-objects/TierRating.js';
import { Winrate } from '../value-objects/Winrate.js';

/**
 * TierCalculationService - Domain service for determining tier ratings
 * Per DDD: Domain services encapsulate domain logic that doesn't naturally fit within entities
 *
 * This service determines tier classification based on performance thresholds.
 * The logic doesn't belong in ChampionStatistics because tier calculation is a
 * standalone operation that could be applied to different contexts.
 */
export class TierCalculationService {
  /**
   * Calculate tier rating based on winrate
   * @param winrate - Champion winrate
   * @returns Tier rating (S+, S, A, B, C, D, F)
   */
  public static calculateTier(winrate: Winrate): TierRating {
    const wr = winrate.toPercentage();

    if (wr >= 54.0) {
      return TierRating.from('S+');
    } else if (wr >= 52.5) {
      return TierRating.from('S');
    } else if (wr >= 51.0) {
      return TierRating.from('A');
    } else if (wr >= 49.5) {
      return TierRating.from('B');
    } else if (wr >= 48.0) {
      return TierRating.from('C');
    } else if (wr >= 46.0) {
      return TierRating.from('D');
    } else {
      return TierRating.from('F');
    }
  }

  /**
   * Determine if a champion qualifies for "OP" (overpowered) status
   * @param winrate - Champion winrate
   * @returns True if winrate indicates OP status
   */
  public static isOverpowered(winrate: Winrate): boolean {
    return winrate.toPercentage() >= 54.0;
  }

  /**
   * Determine if a champion is underpowered
   * @param winrate - Champion winrate
   * @returns True if winrate indicates underpowered status
   */
  public static isUnderpowered(winrate: Winrate): boolean {
    return winrate.toPercentage() < 46.0;
  }

  /**
   * Determine if a champion is balanced
   * @param winrate - Champion winrate
   * @returns True if winrate is within balanced range (48-52%)
   */
  public static isBalanced(winrate: Winrate): boolean {
    const wr = winrate.toPercentage();
    return wr >= 48.0 && wr <= 52.0;
  }
}
