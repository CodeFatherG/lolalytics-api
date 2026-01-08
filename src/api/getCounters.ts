import { ChampionStatisticsService } from '../application/services/ChampionStatisticsService.js';
import { LoLalyticsChampionRepository } from '../infrastructure/repositories/LoLalyticsChampionRepository.js';
import { HttpClient } from '../infrastructure/http/HttpClient.js';
import { RateLimiter } from '../infrastructure/http/RateLimiter.js';
import { SilentLogger } from '../infrastructure/logging/Logger.js';

/**
 * Counter champion information
 */
export interface CounterDTO {
  championName: string;
  winrate: number;
}

/**
 * Get counter champions for a specific champion
 * @param n - Number of counters to return
 * @param champion - Champion to find counters for
 * @param rank - Rank filter (default: '' = Emerald+)
 * @returns Promise resolving to array of counter champions
 * @throws ValidationError if champion name is empty
 * @throws NetworkError if request fails after retries
 * @throws ParsingError if HTML structure is unexpected
 */
export async function getCounters(
  n: number,
  champion: string,
  rank: string = ''
): Promise<CounterDTO[]> {
  // Create infrastructure dependencies
  const rateLimiter = new RateLimiter(10);
  const httpClient = new HttpClient(rateLimiter, new SilentLogger());
  const repository = new LoLalyticsChampionRepository(httpClient);
  const service = new ChampionStatisticsService(repository);

  // Delegate to application service
  return service.getCounters(n, champion, rank);
}
