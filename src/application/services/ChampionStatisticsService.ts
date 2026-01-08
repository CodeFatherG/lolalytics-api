import { ChampionRepository } from '../../domain/champion-statistics/repositories/ChampionRepository.js';
import { ChampionStatsDTO } from '../dto/ChampionStatsDTO.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../domain/shared/value-objects/LaneFilter.js';
import { ValidationError } from '../../domain/shared/errors/ValidationError.js';

/**
 * ChampionStatisticsService - Application service orchestrating champion statistics use cases
 * Coordinates between domain and infrastructure layers
 */
export class ChampionStatisticsService {
  constructor(private readonly championRepository: ChampionRepository) {}

  /**
   * Get detailed statistics for a champion
   * @param championName - Name of the champion
   * @param lane - Lane filter (default: empty = all lanes)
   * @param rank - Rank filter (default: empty = Emerald+)
   * @returns Champion statistics DTO
   * @throws ValidationError if champion name is empty
   */
  async getChampionData(
    championName: string,
    lane: string = '',
    rank: string = ''
  ): Promise<ChampionStatsDTO> {
    // Validate required parameters
    if (!championName || championName.trim() === '') {
      throw ValidationError.forEmptyParameter('championName');
    }

    // Create value objects for filters
    const laneFilter = LaneFilter.from(lane);
    const rankFilter = RankFilter.from(rank);

    // Fetch from repository
    const stats = await this.championRepository.findByName(
      championName.toLowerCase().trim(),
      laneFilter,
      rankFilter
    );

    if (!stats) {
      // Return empty result if champion not found (per spec FR-027)
      return {
        championName: championName.toLowerCase().trim(),
        winrate: 0,
        pickrate: 0,
        banrate: 0,
        tier: 'F',
        rank: 0,
        gamesPlayed: 0,
      };
    }

    // Convert to DTO
    return {
      championName: stats.getChampion().getName(),
      winrate: stats.getWinrate().toPercentage(),
      pickrate: stats.getPickrate().toPercentage(),
      banrate: stats.getBanrate().toPercentage(),
      tier: stats.getTierRating().toString(),
      rank: stats.getRank(),
      gamesPlayed: stats.getGamesPlayed(),
      winrateDelta: stats.getWinrateDelta(),
      gameAverageWinrate: stats.getGameAverageWinrate(),
    };
  }

  /**
   * Get counter champions for a specific champion
   * @param n - Number of counters to return
   * @param championName - Champion to find counters for
   * @param rank - Rank filter (default: empty = Emerald+)
   * @returns Array of counter DTOs
   * @throws ValidationError if champion name is empty
   */
  async getCounters(
    n: number,
    championName: string,
    rank: string = ''
  ): Promise<Array<{ championName: string; winrate: number }>> {
    // Validate required parameters
    if (!championName || championName.trim() === '') {
      throw ValidationError.forEmptyParameter('championName');
    }

    // Create rank filter
    const rankFilter = RankFilter.from(rank);

    // Fetch counters
    const counters = await this.championRepository.findCounters(
      championName.toLowerCase().trim(),
      rankFilter,
      n
    );

    // Convert to DTO format
    return counters.map(counter => ({
      championName: counter.championName,
      winrate: counter.winrateAgainst,
    }));
  }
}
