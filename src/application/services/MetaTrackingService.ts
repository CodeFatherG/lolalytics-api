import { PatchNotesRepository } from '../../domain/meta-tracking/repositories/PatchNotesRepository.js';
import { PatchNotesDTO, PatchChangeDTO } from '../dto/PatchNotesDTO.js';
import { ChangeCategory } from '../../domain/meta-tracking/value-objects/ChangeCategory.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { PatchChange } from '../../domain/meta-tracking/entities/PatchChange.js';

/**
 * MetaTrackingService - Application service orchestrating patch notes use cases
 */
export class MetaTrackingService {
  constructor(private readonly patchNotesRepository: PatchNotesRepository) {}

  /**
   * Get patch notes
   * @param category - Change category (buffed, nerfed, adjusted, or all)
   * @param rank - Rank filter (default: '' = Emerald+)
   * @returns Patch notes DTO
   */
  async getPatchNotes(
    category: string,
    rank: string = ''
  ): Promise<PatchNotesDTO> {
    // Create value objects
    const changeCategory = ChangeCategory.from(category);
    const rankFilter = RankFilter.from(rank);

    // Get categories to fetch
    const categoriesToFetch = changeCategory.getCategoriesToFetch();

    // Fetch data for each category
    const result: PatchNotesDTO = {};

    for (const cat of categoriesToFetch) {
      const changes = await this.patchNotesRepository.findByCategory(cat, rankFilter);
      result[cat] = this.convertToDTO(changes);
    }

    return result;
  }

  /**
   * Convert patch changes to DTOs
   */
  private convertToDTO(changes: PatchChange[]): PatchChangeDTO[] {
    return changes.map(change => ({
      championName: change.getChampionName(),
      winrateDelta: change.getWinrateDelta().toString(),
      pickrateDelta: change.getPickrateDelta().toString(),
      banrateDelta: change.getBanrateDelta().toString(),
    }));
  }
}
