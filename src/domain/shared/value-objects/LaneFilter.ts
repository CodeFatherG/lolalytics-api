/**
 * LaneFilter value object - Immutable lane specification with validation and shortcut mapping
 * Part of Shared Kernel - used across all bounded contexts
 */
export class LaneFilter {
  private static readonly LANE_MAPPINGS: Record<string, string> = {
    '': '',
    'top': 'top',
    'jg': 'jungle',
    'jng': 'jungle',
    'jungle': 'jungle',
    'mid': 'middle',
    'middle': 'middle',
    'bottom': 'bottom',
    'bot': 'bottom',
    'adc': 'bottom',
    'support': 'support',
    'supp': 'support',
    'sup': 'support',
  };

  private readonly value: string;

  private constructor(lane: string) {
    this.value = lane;
  }

  /**
   * Create a LaneFilter from a lane shortcut or canonical name
   * @param lane - Lane shortcut (e.g., 'jg') or canonical name (e.g., 'jungle')
   * @returns LaneFilter instance
   * @throws ValidationError if lane is invalid
   */
  public static from(lane: string): LaneFilter {
    const normalizedLane = lane.toLowerCase().trim();
    const canonicalLane = LaneFilter.LANE_MAPPINGS[normalizedLane];

    if (canonicalLane === undefined) {
      const validLanes = Object.keys(LaneFilter.LANE_MAPPINGS)
        .filter(k => k !== '')
        .join(', ');
      throw new Error(
        `Invalid lane: "${lane}". Valid options: ${validLanes}`
      );
    }

    return new LaneFilter(canonicalLane);
  }

  /**
   * Get the canonical lane value for URL construction
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Get all lane mappings (for displayLanes() function)
   */
  public static getMappings(): Record<string, string> {
    return { ...LaneFilter.LANE_MAPPINGS };
  }

  /**
   * Check if this lane filter is empty (means all lanes)
   */
  public isEmpty(): boolean {
    return this.value === '';
  }
}
