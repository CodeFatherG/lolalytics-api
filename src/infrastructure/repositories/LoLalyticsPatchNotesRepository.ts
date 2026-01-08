import { PatchNotesRepository } from '../../domain/meta-tracking/repositories/PatchNotesRepository.js';
import { PatchChange } from '../../domain/meta-tracking/entities/PatchChange.js';
import { PerformanceDelta } from '../../domain/meta-tracking/value-objects/PerformanceDelta.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { HttpClient } from '../http/HttpClient.js';
import { CheerioParser } from '../parsing/CheerioParser.js';
import { SelectorStrategies } from '../parsing/SelectorStrategies.js';
import { ParsingError } from '../../domain/shared/errors/ParsingError.js';

/**
 * LoLalyticsPatchNotesRepository - Infrastructure implementation for patch notes data access
 */
export class LoLalyticsPatchNotesRepository implements PatchNotesRepository {
  private static readonly BASE_URL = 'https://lolalytics.com';

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Find patch changes by category
   */
  async findByCategory(
    category: 'buffed' | 'nerfed' | 'adjusted',
    rank: RankFilter
  ): Promise<PatchChange[]> {
    const url = this.buildPatchNotesUrl(rank);
    const html = await this.httpClient.fetchHtml(url);
    const $ = CheerioParser.load(html);

    const categoryIndex = this.getCategoryIndex(category);
    const changes: PatchChange[] = [];

    let championIndex = 1;

    while (true) {
      try {
        // Extract data for this champion
        const nameSelector = SelectorStrategies.patchNotesName(categoryIndex, championIndex);
        const winrateSelector = SelectorStrategies.patchNotesWinrate(categoryIndex, championIndex);
        const pickrateSelector = SelectorStrategies.patchNotesPickrate(categoryIndex, championIndex);
        const banrateSelector = SelectorStrategies.patchNotesBanrate(categoryIndex, championIndex);

        const championName = CheerioParser.extractText($, nameSelector, url, `${category} champion ${championIndex}`);
        const winrateDelta = CheerioParser.extractText($, winrateSelector, url, `${category} winrate ${championIndex}`);
        const pickrateDelta = CheerioParser.extractText($, pickrateSelector, url, `${category} pickrate ${championIndex}`);
        const banrateDelta = CheerioParser.extractText($, banrateSelector, url, `${category} banrate ${championIndex}`);

        // Build domain objects
        const patchChange = PatchChange.create(
          championName,
          category,
          PerformanceDelta.fromString(winrateDelta),
          PerformanceDelta.fromString(pickrateDelta),
          PerformanceDelta.fromString(banrateDelta)
        );

        changes.push(patchChange);
        championIndex++;
      } catch (error) {
        // If we can't find this champion, we've reached the end
        if (error instanceof ParsingError) {
          break;
        }
        throw error;
      }
    }

    return changes;
  }

  /**
   * Get category index for selectors (1=buffed, 2=nerfed, 3=adjusted)
   */
  private getCategoryIndex(category: 'buffed' | 'nerfed' | 'adjusted'): number {
    const mapping = {
      buffed: 1,
      nerfed: 2,
      adjusted: 3,
    };
    return mapping[category];
  }

  /**
   * Build URL for patch notes page
   */
  private buildPatchNotesUrl(rank: RankFilter): string {
    let url = LoLalyticsPatchNotesRepository.BASE_URL;

    if (!rank.isEmpty()) {
      url += `?tier=${rank.getValue()}`;
    }

    return url;
  }
}
