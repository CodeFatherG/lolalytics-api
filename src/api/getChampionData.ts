import { ChampionStatisticsService } from '../application/services/ChampionStatisticsService.js';
import { LoLalyticsChampionRepository } from '../infrastructure/repositories/LoLalyticsChampionRepository.js';
import { HttpClient } from '../infrastructure/http/HttpClient.js';
import { RateLimiter } from '../infrastructure/http/RateLimiter.js';
import { SilentLogger } from '../infrastructure/logging/Logger.js';
import { ChampionStatsDTO } from '../application/dto/ChampionStatsDTO.js';

/**
 * Get detailed statistics for a specific champion
 * @param champion - Champion name
 * @param lane - Lane filter (default: '' = all lanes)
 * @param rank - Rank filter (default: '' = Emerald+)
 * @returns Promise resolving to champion statistics
 * @throws ValidationError if champion name is empty
 * @throws NetworkError if request fails after retries
 * @throws ParsingError if HTML structure is unexpected
 */
export async function getChampionData(
  champion: string,
  lane: string = '',
  rank: string = ''
): Promise<ChampionStatsDTO> {
  // Create infrastructure dependencies
  const rateLimiter = new RateLimiter(10);
  const httpClient = new HttpClient(rateLimiter, new SilentLogger());
  const repository = new LoLalyticsChampionRepository(httpClient);
  const service = new ChampionStatisticsService(repository);

  // Delegate to application service
  return service.getChampionData(champion, lane, rank);
}
