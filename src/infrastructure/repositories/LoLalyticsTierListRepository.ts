import { TierListRepository } from '../../domain/tier-list/repositories/TierListRepository.js';
import { TierList } from '../../domain/tier-list/entities/TierList.js';
import { TierListEntry } from '../../domain/tier-list/entities/TierListEntry.js';
import { TierRating } from '../../domain/champion-statistics/value-objects/TierRating.js';
import { Winrate } from '../../domain/champion-statistics/value-objects/Winrate.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../domain/shared/value-objects/LaneFilter.js';
import { HttpClient } from '../http/HttpClient.js';
import { CheerioParser } from '../parsing/CheerioParser.js';
import { SelectorStrategies } from '../parsing/SelectorStrategies.js';
import { ParsingError } from '../../domain/shared/errors/ParsingError.js';

/**
 * LoLalyticsTierListRepository - Infrastructure implementation for tier list data access
 */
export class LoLalyticsTierListRepository implements TierListRepository {
  private static readonly BASE_URL = 'https://lolalytics.com/lol/tierlist';

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Find tier list with filters
   */
  async findTierList(
    lane: LaneFilter,
    rank: RankFilter,
    limit: number
  ): Promise<TierList> {
    const url = this.buildTierListUrl(lane, rank);
    const html = await this.httpClient.fetchHtml(url);
    const $ = CheerioParser.load(html);

    const entries: TierListEntry[] = [];

    // Tier list rows start at index 3 (per Python implementation)
    for (let i = 0; i < limit; i++) {
      const rowIndex = i + 3;

      try {
        // Extract data from each column
        const rankSelector = SelectorStrategies.tierListRank(rowIndex);
        const championSelector = SelectorStrategies.tierListChampion(rowIndex);
        const tierSelector = SelectorStrategies.tierListTier(rowIndex);
        const winrateSelector = SelectorStrategies.tierListWinrate(rowIndex);

        const rankStr = CheerioParser.extractText($, rankSelector, url, `tier list rank ${i + 1}`);
        const championName = CheerioParser.extractText($, championSelector, url, `tier list champion ${i + 1}`);
        const tierStr = CheerioParser.extractText($, tierSelector, url, `tier list tier ${i + 1}`);
        const winrateStr = CheerioParser.extractText($, winrateSelector, url, `tier list winrate ${i + 1}`);

        // Build domain objects
        const rank = parseInt(rankStr, 10);
        const tier = TierRating.from(tierStr);
        const winrate = Winrate.fromString(winrateStr);

        const entry = TierListEntry.create(rank, championName.toLowerCase(), tier, winrate);
        entries.push(entry);
      } catch (error) {
        // If we can't find this row, we've reached the end of available data
        if (error instanceof ParsingError) {
          break;
        }
        throw error;
      }
    }

    if (entries.length === 0) {
      throw ParsingError.forUnexpectedStructure(
        url,
        'tier list page',
        'No tier list entries found'
      );
    }

    return TierList.create(entries);
  }

  /**
   * Build URL for tier list page
   */
  private buildTierListUrl(lane: LaneFilter, rank: RankFilter): string {
    let url = LoLalyticsTierListRepository.BASE_URL;

    const params: string[] = [];

    if (!lane.isEmpty()) {
      params.push(`lane=${lane.getValue()}`);
    }

    if (!rank.isEmpty()) {
      params.push(`tier=${rank.getValue()}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return url;
  }
}
