import { LaneFilter } from '../domain/shared/value-objects/LaneFilter.js';

/**
 * Lane mapping type
 */
export type LaneMappings = Record<string, string>;

/**
 * Display all available lane shortcuts and their canonical names
 * @returns Object mapping lane shortcuts to canonical lane names
 */
export function displayLanes(): LaneMappings {
  return LaneFilter.getMappings();
}
