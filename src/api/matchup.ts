import { MatchupAnalysisService } from '../application/services/MatchupAnalysisService.js';
import { LoLalyticsMatchupRepository } from '../infrastructure/repositories/LoLalyticsMatchupRepository.js';
import { HttpClient } from '../infrastructure/http/HttpClient.js';
import { RateLimiter } from '../infrastructure/http/RateLimiter.js';
import { SilentLogger } from '../infrastructure/logging/Logger.js';
import { MatchupDTO } from '../application/dto/MatchupDTO.js';

/**
 * Get matchup data between two champions
 * @param champion1 - First champion name
 * @param champion2 - Second champion name
 * @param lane - Lane filter (default: '' = all lanes)
 * @param rank - Rank filter (default: '' = Emerald+)
 * @returns Promise resolving to matchup data
 * @throws ValidationError if champion names are empty or same
 * @throws NetworkError if request fails after retries
 * @throws ParsingError if HTML structure is unexpected
 */
export async function matchup(
  champion1: string,
  champion2: string,
  lane: string = '',
  rank: string = ''
): Promise<MatchupDTO> {
  // Create infrastructure dependencies
  const rateLimiter = new RateLimiter(10);
  const httpClient = new HttpClient(rateLimiter, new SilentLogger());
  const repository = new LoLalyticsMatchupRepository(httpClient);
  const service = new MatchupAnalysisService(repository);

  // Delegate to application service
  return service.getMatchup(champion1, champion2, lane, rank);
}
