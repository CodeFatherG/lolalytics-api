import { TierListService } from '../application/services/TierListService.js';
import { LoLalyticsTierListRepository } from '../infrastructure/repositories/LoLalyticsTierListRepository.js';
import { HttpClient } from '../infrastructure/http/HttpClient.js';
import { RateLimiter } from '../infrastructure/http/RateLimiter.js';
import { SilentLogger } from '../infrastructure/logging/Logger.js';
import { TierListDTO } from '../application/dto/TierListDTO.js';

/**
 * Get tier list of top champions
 * @param n - Number of champions to return
 * @param lane - Lane filter (default: '' = all lanes)
 * @param rank - Rank filter (default: '' = Emerald+)
 * @returns Promise resolving to tier list array
 * @throws NetworkError if request fails after retries
 * @throws ParsingError if HTML structure is unexpected
 */
export async function getTierlist(
  n: number = 10,
  lane: string = '',
  rank: string = ''
): Promise<TierListDTO> {
  // Create infrastructure dependencies
  const rateLimiter = new RateLimiter(10);
  const httpClient = new HttpClient(rateLimiter, new SilentLogger());
  const repository = new LoLalyticsTierListRepository(httpClient);
  const service = new TierListService(repository);

  // Delegate to application service
  return service.getTierlist(n, lane, rank);
}
