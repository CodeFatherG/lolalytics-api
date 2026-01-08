import { ChampionStatistics } from '../entities/ChampionStatistics.js';
import { RankFilter } from '../../shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../shared/value-objects/LaneFilter.js';

/**
 * ChampionRepository interface - Domain boundary for champion data access
 * Per DDD: Repository abstracts data access behind domain-focused interface
 *
 * This interface belongs to the domain layer. Infrastructure implementations
 * will handle HTML parsing, but the domain doesn't know or care about that.
 */
export interface ChampionRepository {
  /**
   * Find detailed statistics for a specific champion
   * @param championName - Name of the champion
   * @param lane - Lane filter (optional)
   * @param rank - Rank filter (optional)
   * @returns Champion statistics or null if not found
   */
  findByName(
    championName: string,
    lane: LaneFilter,
    rank: RankFilter
  ): Promise<ChampionStatistics | null>;

  /**
   * Find counter champions for a specific champion
   * @param championName - Name of the champion to find counters for
   * @param rank - Rank filter (optional)
   * @param limit - Maximum number of counters to return
   * @returns Array of counter champion names with winrates against the target
   */
  findCounters(
    championName: string,
    rank: RankFilter,
    limit: number
  ): Promise<Array<{ championName: string; winrateAgainst: number }>>;
}
