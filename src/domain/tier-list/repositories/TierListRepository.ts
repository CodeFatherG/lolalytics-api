import { TierList } from '../entities/TierList.js';
import { RankFilter } from '../../shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../shared/value-objects/LaneFilter.js';

/**
 * TierListRepository interface - Domain boundary for tier list data access
 * Per DDD: Repository abstracts data access behind domain-focused interface
 */
export interface TierListRepository {
  /**
   * Find tier list for specified filters
   * @param lane - Lane filter (optional)
   * @param rank - Rank filter (optional)
   * @param limit - Maximum number of entries to return
   * @returns TierList aggregate
   */
  findTierList(
    lane: LaneFilter,
    rank: RankFilter,
    limit: number
  ): Promise<TierList>;
}
