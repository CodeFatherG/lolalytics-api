import { MetaTrackingService } from '../application/services/MetaTrackingService.js';
import { LoLalyticsPatchNotesRepository } from '../infrastructure/repositories/LoLalyticsPatchNotesRepository.js';
import { HttpClient } from '../infrastructure/http/HttpClient.js';
import { RateLimiter } from '../infrastructure/http/RateLimiter.js';
import { SilentLogger } from '../infrastructure/logging/Logger.js';
import { PatchNotesDTO } from '../application/dto/PatchNotesDTO.js';

/**
 * Get patch notes showing champion performance changes
 * @param category - Change category ('buffed', 'nerfed', 'adjusted', or 'all')
 * @param rank - Rank filter (default: '' = Emerald+)
 * @returns Promise resolving to patch notes data
 * @throws ValidationError if category is invalid
 * @throws NetworkError if request fails after retries
 * @throws ParsingError if HTML structure is unexpected
 */
export async function patchNotes(
  category: string,
  rank: string = ''
): Promise<PatchNotesDTO> {
  // Create infrastructure dependencies
  const rateLimiter = new RateLimiter(10);
  const httpClient = new HttpClient(rateLimiter, new SilentLogger());
  const repository = new LoLalyticsPatchNotesRepository(httpClient);
  const service = new MetaTrackingService(repository);

  // Delegate to application service
  return service.getPatchNotes(category, rank);
}
