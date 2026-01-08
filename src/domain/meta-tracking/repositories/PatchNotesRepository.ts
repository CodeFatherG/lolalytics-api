import { PatchChange } from '../entities/PatchChange.js';
import { RankFilter } from '../../shared/value-objects/RankFilter.js';

/**
 * PatchNotesRepository interface - Domain boundary for patch notes data access
 * Per DDD: Repository abstracts data access behind domain-focused interface
 */
export interface PatchNotesRepository {
  /**
   * Find patch changes by category
   * @param category - Change category (buffed, nerfed, or adjusted)
   * @param rank - Rank filter (optional)
   * @returns Array of patch changes
   */
  findByCategory(
    category: 'buffed' | 'nerfed' | 'adjusted',
    rank: RankFilter
  ): Promise<PatchChange[]>;
}
