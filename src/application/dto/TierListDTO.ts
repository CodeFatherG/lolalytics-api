/**
 * TierListEntryDTO - Data Transfer Object for a single tier list entry
 */
export interface TierListEntryDTO {
  rank: number;
  championName: string;
  tier: string;
  winrate: number;
}

/**
 * TierListDTO - Data Transfer Object for tier list response
 */
export type TierListDTO = TierListEntryDTO[];
