/**
 * RankFilter value object - Immutable rank specification with validation and shortcut mapping
 * Part of Shared Kernel - used across all bounded contexts
 */
export class RankFilter {
  private static readonly RANK_MAPPINGS: Record<string, string> = {
    '': '',
    'challenger': 'challenger',
    'chall': 'challenger',
    'c': 'challenger',
    'grandmaster_plus': 'grandmaster_plus',
    'grandmaster+': 'grandmaster_plus',
    'gm+': 'grandmaster_plus',
    'grandmaster': 'grandmaster',
    'grandm': 'grandmaster',
    'gm': 'grandmaster',
    'master_plus': 'master_plus',
    'master+': 'master_plus',
    'mast+': 'master_plus',
    'm+': 'master_plus',
    'master': 'master',
    'mast': 'master',
    'm': 'master',
    'diamond_plus': 'diamond_plus',
    'diamond+': 'diamond_plus',
    'diam+': 'diamond_plus',
    'dia+': 'diamond_plus',
    'd+': 'diamond_plus',
    'diamond': 'diamond',
    'diam': 'diamond',
    'dia': 'diamond',
    'd': 'diamond',
    'emerald': 'emerald',
    'eme': 'emerald',
    'em': 'emerald',
    'e': 'emerald',
    'platinum+': 'platinum_plus',
    'plat+': 'platinum_plus',
    'pl+': 'platinum_plus',
    'p+': 'platinum_plus',
    'platinum': 'platinum',
    'plat': 'platinum',
    'pl': 'platinum',
    'p': 'platinum',
    'gold_plus': 'gold_plus',
    'gold+': 'gold_plus',
    'g+': 'gold_plus',
    'gold': 'gold',
    'g': 'gold',
    'silver': 'silver',
    'silv': 'silver',
    's': 'silver',
    'bronze': 'bronze',
    'br': 'bronze',
    'b': 'bronze',
    'iron': 'iron',
    'i': 'iron',
    'unranked': 'unranked',
    'unrank': 'unranked',
    'unr': 'unranked',
    'un': 'unranked',
    'none': 'unranked',
    'null': 'unranked',
    '-': 'unranked',
    'all': 'all',
    'otp': '1trick',
    '1trick': '1trick',
    '1-trick': '1trick',
    '1trickpony': '1trick',
    'onetrickpony': '1trick',
    'onetrick': '1trick',
  };

  private readonly value: string;

  private constructor(rank: string) {
    this.value = rank;
  }

  /**
   * Create a RankFilter from a rank shortcut or canonical name
   * @param rank - Rank shortcut (e.g., 'gm+') or canonical name (e.g., 'grandmaster_plus')
   * @returns RankFilter instance
   * @throws ValidationError if rank is invalid
   */
  public static from(rank: string): RankFilter {
    const normalizedRank = rank.toLowerCase().trim();
    const canonicalRank = RankFilter.RANK_MAPPINGS[normalizedRank];

    if (canonicalRank === undefined) {
      const validRanks = Object.keys(RankFilter.RANK_MAPPINGS)
        .filter(k => k !== '')
        .slice(0, 10)
        .join(', ');
      throw new Error(
        `Invalid rank: "${rank}". Valid options include: ${validRanks}, ... (see displayRanks() for full list)`
      );
    }

    return new RankFilter(canonicalRank);
  }

  /**
   * Get the canonical rank value for URL construction
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Get all rank mappings (for displayRanks() function)
   */
  public static getMappings(): Record<string, string> {
    return { ...RankFilter.RANK_MAPPINGS };
  }

  /**
   * Check if this rank filter is empty (defaults to Emerald+)
   */
  public isEmpty(): boolean {
    return this.value === '';
  }
}
