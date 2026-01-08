import { MatchupRepository } from '../../domain/matchup-analysis/repositories/MatchupRepository.js';
import { MatchupResult } from '../../domain/matchup-analysis/entities/MatchupResult.js';
import { Winrate } from '../../domain/champion-statistics/value-objects/Winrate.js';
import { RankFilter } from '../../domain/shared/value-objects/RankFilter.js';
import { LaneFilter } from '../../domain/shared/value-objects/LaneFilter.js';
import { HttpClient } from '../http/HttpClient.js';
import { CheerioParser } from '../parsing/CheerioParser.js';
import { SelectorStrategies } from '../parsing/SelectorStrategies.js';
import { ParsingError } from '../../domain/shared/errors/ParsingError.js';

/**
 * LoLalyticsMatchupRepository - Infrastructure implementation for matchup data access
 */
export class LoLalyticsMatchupRepository implements MatchupRepository {
  private static readonly BASE_URL = 'https://lolalytics.com/lol';

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Find matchup between two champions
   */
  async findMatchup(
    champion1: string,
    champion2: string,
    lane: LaneFilter,
    rank: RankFilter
  ): Promise<MatchupResult | null> {
    const url = this.buildMatchupUrl(champion1, champion2, lane, rank);
    const html = await this.httpClient.fetchHtml(url);
    const $ = CheerioParser.load(html);

    try {
      // Extract matchup data
      const winrateSelector = SelectorStrategies.matchupWinrate();
      const gamesSelector = SelectorStrategies.matchupGames();

      const winrateStr = CheerioParser.extractText($, winrateSelector, url, 'matchup winrate');
      const gamesStr = CheerioParser.extractText($, gamesSelector, url, 'matchup games');

      // Parse winrate (remove % sign)
      const winrate = Winrate.fromString(winrateStr);

      // Parse number of games
      const totalGames = this.parseGamesCount(gamesStr);

      return MatchupResult.create(champion1, champion2, winrate, totalGames);
    } catch (error) {
      if (error instanceof ParsingError) {
        // If parsing failed, matchup data might not exist
        return null;
      }
      throw ParsingError.forUnexpectedStructure(
        url,
        'matchup page',
        (error as Error).message
      );
    }
  }

  /**
   * Build URL for matchup page
   */
  private buildMatchupUrl(
    champion1: string,
    champion2: string,
    lane: LaneFilter,
    rank: RankFilter
  ): string {
    let url = `${LoLalyticsMatchupRepository.BASE_URL}/${champion1}/vs/${champion2}/build/`;

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
   * Parse games count string (e.g., "1,234 Games" or "1.2K Games")
   */
  private parseGamesCount(gamesStr: string): number {
    // Remove "Games" and commas
    const cleaned = gamesStr.replace(/Games/i, '').replace(/,/g, '').trim();

    if (cleaned.endsWith('K')) {
      return Math.floor(parseFloat(cleaned) * 1000);
    } else if (cleaned.endsWith('M')) {
      return Math.floor(parseFloat(cleaned) * 1000000);
    }

    return parseInt(cleaned, 10) || 0;
  }
}
