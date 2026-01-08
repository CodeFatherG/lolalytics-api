import { MatchupRepository } from '../../domain/matchup-analysis/repositories/MatchupRepository.js';
import { MatchupDTO } from '../dto/MatchupDTO.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../domain/shared/value-objects/LaneFilter.js';
import { ValidationError } from '../../domain/shared/errors/ValidationError.js';

/**
 * MatchupAnalysisService - Application service orchestrating matchup analysis use cases
 */
export class MatchupAnalysisService {
  constructor(private readonly matchupRepository: MatchupRepository) {}

  /**
   * Get matchup data between two champions
   * @param champion1 - First champion name
   * @param champion2 - Second champion name
   * @param lane - Lane filter (default: '' = all lanes)
   * @param rank - Rank filter (default: '' = Emerald+)
   * @returns Matchup DTO
   * @throws ValidationError if champion names are empty or same
   */
  async getMatchup(
    champion1: string,
    champion2: string,
    lane: string = '',
    rank: string = ''
  ): Promise<MatchupDTO> {
    // Validate required parameters
    if (!champion1 || champion1.trim() === '') {
      throw ValidationError.forEmptyParameter('champion1');
    }

    if (!champion2 || champion2.trim() === '') {
      throw ValidationError.forEmptyParameter('champion2');
    }

    // Validate champions are different
    const c1 = champion1.toLowerCase().trim();
    const c2 = champion2.toLowerCase().trim();

    if (c1 === c2) {
      throw ValidationError.forInvalidValue(
        'champion2',
        champion2,
        'Champion 2 must be different from Champion 1'
      );
    }

    // Create value objects for filters
    const laneFilter = LaneFilter.from(lane);
    const rankFilter = RankFilter.from(rank);

    // Fetch matchup from repository
    const matchup = await this.matchupRepository.findMatchup(
      c1,
      c2,
      laneFilter,
      rankFilter
    );

    if (!matchup) {
      // Return empty result if matchup not found
      return {
        champion1: c1,
        champion2: c2,
        winrate: 50,
        totalGames: 0,
      };
    }

    // Convert to DTO
    return {
      champion1: matchup.getChampion1(),
      champion2: matchup.getChampion2(),
      winrate: matchup.getWinrate().toPercentage(),
      totalGames: matchup.getTotalGames(),
    };
  }
}
