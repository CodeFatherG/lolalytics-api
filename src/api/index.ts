/**
 * LoLalytics API - TypeScript library for scraping LoLalytics League of Legends statistics
 *
 * This library provides 7 public functions for retrieving champion statistics,
 * tier lists, counters, matchups, and patch notes from LoLalytics.com
 *
 * All functions use async/await patterns and return properly typed results.
 */

export { getTierlist } from './getTierlist.js';
export { getChampionData } from './getChampionData.js';
export { getCounters } from './getCounters.js';
export { matchup } from './matchup.js';
export { patchNotes } from './patchNotes.js';
export { displayRanks } from './displayRanks.js';
export { displayLanes } from './displayLanes.js';

// Export types
export type { TierListDTO, TierListEntryDTO } from '../application/dto/TierListDTO.js';
export type { ChampionStatsDTO } from '../application/dto/ChampionStatsDTO.js';
export type { CounterDTO } from './getCounters.js';
export type { MatchupDTO } from '../application/dto/MatchupDTO.js';
export type { PatchNotesDTO, PatchChangeDTO } from '../application/dto/PatchNotesDTO.js';
export type { RankMappings } from './displayRanks.js';
export type { LaneMappings } from './displayLanes.js';

// Export errors for consumers
export { ValidationError } from '../domain/shared/errors/ValidationError.js';
export { NetworkError } from '../domain/shared/errors/NetworkError.js';
export { ParsingError } from '../domain/shared/errors/ParsingError.js';
