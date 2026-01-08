import { TierListEntry } from './TierListEntry.js';

/**
 * TierList aggregate root - Collection of ranked champions
 * Per DDD: Aggregate root controls access to contained entities
 */
export class TierList {
  private constructor(private readonly entries: ReadonlyArray<TierListEntry>) {
    // Invariant: Entries must be sorted by rank
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].getRank() <= entries[i - 1].getRank()) {
        throw new Error('TierList entries must be sorted by rank');
      }
    }
  }

  /**
   * Create a TierList from entries
   */
  public static create(entries: TierListEntry[]): TierList {
    // Sort by rank to enforce invariant
    const sorted = [...entries].sort((a, b) => a.getRank() - b.getRank());
    return new TierList(sorted);
  }

  /**
   * Get all entries
   */
  public getEntries(): ReadonlyArray<TierListEntry> {
    return this.entries;
  }

  /**
   * Get entry by rank position
   */
  public getEntryByRank(rank: number): TierListEntry | undefined {
    return this.entries.find(e => e.getRank() === rank);
  }

  /**
   * Get top N entries
   */
  public getTopN(n: number): TierListEntry[] {
    return this.entries.slice(0, Math.min(n, this.entries.length));
  }

  /**
   * Get all S-tier and above champions
   */
  public getTopTierChampions(): TierListEntry[] {
    return this.entries.filter(e => e.isTopTier());
  }

  /**
   * Get total number of entries
   */
  public getSize(): number {
    return this.entries.length;
  }

  /**
   * Find entry by champion name
   */
  public findByChampion(championName: string): TierListEntry | undefined {
    const normalized = championName.toLowerCase().trim();
    return this.entries.find(
      e => e.getChampionName().toLowerCase() === normalized
    );
  }
}
