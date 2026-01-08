import { TierListRepository } from '../../domain/tier-list/repositories/TierListRepository.js';
import { TierListDTO } from '../dto/TierListDTO.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../domain/shared/value-objects/LaneFilter.js';

/**
 * TierListService - Application service orchestrating tier list use cases
 */
export class TierListService {
  constructor(private readonly tierListRepository: TierListRepository) {}

  /**
   * Get tier list
   * @param n - Number of champions to return
   * @param lane - Lane filter (default: '' = all lanes)
   * @param rank - Rank filter (default: '' = Emerald+)
   * @returns Tier list DTO array
   */
  async getTierlist(
    n: number,
    lane: string = '',
    rank: string = ''
  ): Promise<TierListDTO> {
    // Create value objects for filters
    const laneFilter = LaneFilter.from(lane);
    const rankFilter = RankFilter.from(rank);

    // Fetch tier list
    const tierList = await this.tierListRepository.findTierList(
      laneFilter,
      rankFilter,
      n
    );

    // Convert to DTO
    return tierList.getTopN(n).map(entry => ({
      rank: entry.getRank(),
      championName: entry.getChampionName(),
      tier: entry.getTier().toString(),
      winrate: entry.getWinrate().toPercentage(),
    }));
  }
}
