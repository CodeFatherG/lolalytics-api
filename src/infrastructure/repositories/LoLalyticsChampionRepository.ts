import { ChampionRepository } from '../../domain/champion-statistics/repositories/ChampionRepository.js';
import { ChampionStatistics } from '../../domain/champion-statistics/entities/ChampionStatistics.js';
import { Champion } from '../../domain/champion-statistics/entities/Champion.js';
import { Winrate } from '../../domain/champion-statistics/value-objects/Winrate.js';
import { Pickrate } from '../../domain/champion-statistics/value-objects/Pickrate.js';
import { Banrate } from '../../domain/champion-statistics/value-objects/Banrate.js';
import { TierRating } from '../../domain/champion-statistics/value-objects/TierRating.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../domain/shared/value-objects/LaneFilter.js';
import { HttpClient } from '../http/HttpClient.js';
import { CheerioParser } from '../parsing/CheerioParser.js';
import { SelectorStrategies } from '../parsing/SelectorStrategies.js';
import { ParsingError } from '../../domain/shared/errors/ParsingError.js';

/**
 * LoLalyticsChampionRepository - Infrastructure implementation for champion data access
 * Implements Anti-Corruption Layer pattern to protect domain from LoLalytics HTML structure
 */
export class LoLalyticsChampionRepository implements ChampionRepository {
  private static readonly BASE_URL = 'https://lolalytics.com/lol';

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Find champion statistics by name
   */
  async findByName(
    championName: string,
    lane: LaneFilter,
    rank: RankFilter
  ): Promise<ChampionStatistics | null> {
    const url = this.buildChampionUrl(championName, lane, rank);
    const html = await this.httpClient.fetchHtml(url);
    const $ = CheerioParser.load(html);

    try {
      // Parse champion data using the 8-field grid structure
      // Labels: winrate, wr_delta, game_avg_wr, pickrate, tier, rank, banrate, games
      const labels = [
        'winrate',
        'wr_delta',
        'game_avg_wr',
        'pickrate',
        'tier',
        'rank',
        'banrate',
        'games',
      ];

      const data: Record<string, string> = {};

      for (let i = 1; i <= 8; i++) {
        const row = Math.floor((i - 1) / 4) + 1;
        const col = ((i - 1) % 4) + 1;
        const selector = SelectorStrategies.championDataStat(row, col);

        try {
          const value = CheerioParser.extractText($, selector, url, `${labels[i - 1]} stat`);
          data[labels[i - 1]] = value.split('\n')[0].trim(); // Take first line only
        } catch (error) {
          // If element not found, champion might not exist
          if (i === 1) {
            return null; // No data found for this champion
          }
          throw error;
        }
      }

      // Build domain objects
      const champion = Champion.create(championName, lane.getValue());
      const winrate = Winrate.fromString(data.winrate);
      const pickrate = Pickrate.fromString(data.pickrate);
      const banrate = Banrate.fromString(data.banrate);
      const tierRating = TierRating.from(data.tier);
      const rankPosition = parseInt(data.rank, 10);
      const gamesPlayed = this.parseGamesPlayed(data.games);

      return ChampionStatistics.create({
        champion,
        winrate,
        pickrate,
        banrate,
        tierRating,
        rank: rankPosition,
        gamesPlayed,
        winrateDelta: data.wr_delta,
        gameAverageWinrate: data.game_avg_wr,
      });
    } catch (error) {
      if (error instanceof ParsingError) {
        throw error;
      }
      throw ParsingError.forUnexpectedStructure(
        url,
        'champion statistics page',
        (error as Error).message
      );
    }
  }

  /**
   * Find counter champions
   */
  async findCounters(
    championName: string,
    rank: RankFilter,
    limit: number
  ): Promise<Array<{ championName: string; winrateAgainst: number }>> {
    const url = this.buildCountersUrl(championName, rank);
    const html = await this.httpClient.fetchHtml(url);
    const $ = CheerioParser.load(html);

    const counters: Array<{ championName: string; winrateAgainst: number }> = [];

    for (let i = 1; i <= limit; i++) {
      try {
        const nameSelector = SelectorStrategies.counterName(i);
        const winrateSelector = SelectorStrategies.counterWinrate(i);

        const name = CheerioParser.extractText($, nameSelector, url, `counter ${i} name`);
        const winrateStr = CheerioParser.extractText($, winrateSelector, url, `counter ${i} winrate`);

        // Parse winrate (remove % and convert to number)
        const winrateValue = parseFloat(winrateStr.replace('%', '').trim());

        counters.push({
          championName: name.toLowerCase(),
          winrateAgainst: winrateValue,
        });
      } catch (error) {
        // If we can't find this counter, we've reached the end
        break;
      }
    }

    return counters;
  }

  /**
   * Build URL for champion statistics page
   */
  private buildChampionUrl(championName: string, lane: LaneFilter, rank: RankFilter): string {
    let url = `${LoLalyticsChampionRepository.BASE_URL}/${championName}/build/`;

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

  /**
   * Build URL for counters page
   */
  private buildCountersUrl(championName: string, rank: RankFilter): string {
    let url = `${LoLalyticsChampionRepository.BASE_URL}/${championName}/counters/`;

    if (!rank.isEmpty()) {
      url += `?tier=${rank.getValue()}`;
    }

    return url;
  }

  /**
   * Parse games played string (e.g., "1,234" or "1.2K")
   */
  private parseGamesPlayed(gamesStr: string): number {
    const cleaned = gamesStr.replace(/,/g, '').trim();

    if (cleaned.endsWith('K')) {
      return Math.floor(parseFloat(cleaned) * 1000);
    } else if (cleaned.endsWith('M')) {
      return Math.floor(parseFloat(cleaned) * 1000000);
    }

    return parseInt(cleaned, 10) || 0;
  }
}
