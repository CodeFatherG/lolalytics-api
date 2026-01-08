/**
 * ChampionStatsDTO - Data Transfer Object for champion statistics
 * Used to serialize ChampionStatistics aggregate to TypeScript-idiomatic format
 */
export interface ChampionStatsDTO {
  championName: string;
  winrate: number;
  pickrate: number;
  banrate: number;
  tier: string;
  rank: number;
  gamesPlayed: number;
  winrateDelta?: string;
  gameAverageWinrate?: string;
}
