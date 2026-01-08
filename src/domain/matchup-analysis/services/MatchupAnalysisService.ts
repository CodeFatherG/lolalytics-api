import { MatchupResult } from '../entities/MatchupResult.js';
import { CounterEffectiveness } from '../value-objects/CounterEffectiveness.js';

/**
 * MatchupAnalysisService - Domain service for analyzing champion matchups
 * Per DDD: Domain service for matchup analysis logic
 */
export class MatchupAnalysisService {
  /**
   * Analyze counter effectiveness based on winrate
   */
  public static analyzeCounterEffectiveness(
    matchup: MatchupResult
  ): CounterEffectiveness {
    // Counter effectiveness is based on how much the winrate deviates from 50%
    const advantage = matchup.getAdvantage();
    return CounterEffectiveness.fromWinrateDifference(advantage);
  }

  /**
   * Determine if champion1 counters champion2
   */
  public static isCounter(matchup: MatchupResult): boolean {
    const effectiveness = this.analyzeCounterEffectiveness(matchup);
    return effectiveness.getValue() >= 2.0;
  }

  /**
   * Determine if this is a skill matchup (relatively even)
   */
  public static isSkillMatchup(matchup: MatchupResult): boolean {
    return matchup.isBalanced();
  }

  /**
   * Get matchup difficulty classification
   */
  public static getMatchupDifficulty(
    matchup: MatchupResult
  ): 'very-hard' | 'hard' | 'medium' | 'easy' | 'very-easy' {
    const wr = matchup.getWinrate().toPercentage();

    if (wr < 45) {
      return 'very-hard';
    } else if (wr < 48) {
      return 'hard';
    } else if (wr <= 52) {
      return 'medium';
    } else if (wr <= 55) {
      return 'easy';
    } else {
      return 'very-easy';
    }
  }
}
