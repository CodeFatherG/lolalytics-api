import { RankFilter } from '../domain/shared/value-objects/RankFilter.js';

/**
 * Rank mapping type
 */
export type RankMappings = Record<string, string>;

/**
 * Display all available rank shortcuts and their canonical names
 * @returns Object mapping rank shortcuts to canonical rank names
 */
export function displayRanks(): RankMappings {
  return RankFilter.getMappings();
}
