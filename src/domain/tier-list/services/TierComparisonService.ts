import { TierListEntry } from '../entities/TierListEntry.js';

/**
 * TierComparisonService - Domain service for comparing champions in tier lists
 * Per DDD: Domain service for operations that don't naturally belong to entities
 */
export class TierComparisonService {
  /**
   * Compare two tier list entries
   * @returns Positive if first is better ranked, negative if worse, 0 if equal
   */
  public static compare(entry1: TierListEntry, entry2: TierListEntry): number {
    // Lower rank number = better position
    return entry2.getRank() - entry1.getRank();
  }

  /**
   * Determine if a champion is significantly better than another
   * @param entry1 - First champion
   * @param entry2 - Second champion
   * @returns True if entry1 is at least 2 tiers better
   */
  public static isSignificantlyBetter(
    entry1: TierListEntry,
    entry2: TierListEntry
  ): boolean {
    const tierDiff = entry1.getTier().compareTo(entry2.getTier());
    return tierDiff >= 2;
  }

  /**
   * Get the tier gap between two champions
   */
  public static getTierGap(
    entry1: TierListEntry,
    entry2: TierListEntry
  ): number {
    return Math.abs(entry1.getTier().compareTo(entry2.getTier()));
  }

  /**
   * Get the rank gap between two champions
   */
  public static getRankGap(
    entry1: TierListEntry,
    entry2: TierListEntry
  ): number {
    return Math.abs(entry1.getRank() - entry2.getRank());
  }
}
