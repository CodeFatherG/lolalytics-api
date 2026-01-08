/**
 * MatchupDTO - Data Transfer Object for matchup results
 */
export interface MatchupDTO {
  champion1: string;
  champion2: string;
  winrate: number;
  totalGames: number;
}
