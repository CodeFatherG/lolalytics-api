import { MatchupResult } from '../entities/MatchupResult.js';
import { RankFilter } from '../../shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../shared/value-objects/LaneFilter.js';

/**
 * MatchupRepository interface - Domain boundary for matchup data access
 * Per DDD: Repository abstracts data access behind domain-focused interface
 */
export interface MatchupRepository {
  /**
   * Find matchup result between two champions
   * @param champion1 - First champion name
   * @param champion2 - Second champion name
   * @param lane - Lane filter (optional)
   * @param rank - Rank filter (optional)
   * @returns Matchup result or null if not found
   */
  findMatchup(
    champion1: string,
    champion2: string,
    lane: LaneFilter,
    rank: RankFilter
  ): Promise<MatchupResult | null>;
}
