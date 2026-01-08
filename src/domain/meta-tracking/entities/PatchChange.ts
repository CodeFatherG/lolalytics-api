import { PerformanceDelta } from '../value-objects/PerformanceDelta.js';

/**
 * PatchChange aggregate root - Represents balance changes affecting a champion
 * Per DDD: Aggregate root for patch-based champion changes
 */
export class PatchChange {
  private constructor(
    private readonly championName: string,
    private readonly category: 'buffed' | 'nerfed' | 'adjusted',
    private readonly winrateDelta: PerformanceDelta,
    private readonly pickrateDelta: PerformanceDelta,
    private readonly banrateDelta: PerformanceDelta
  ) {}

  /**
   * Create a PatchChange aggregate
   */
  public static create(
    championName: string,
    category: 'buffed' | 'nerfed' | 'adjusted',
    winrateDelta: PerformanceDelta,
    pickrateDelta: PerformanceDelta,
    banrateDelta: PerformanceDelta
  ): PatchChange {
    return new PatchChange(
      championName.toLowerCase().trim(),
      category,
      winrateDelta,
      pickrateDelta,
      banrateDelta
    );
  }

  /**
   * Get champion name
   */
  public getChampionName(): string {
    return this.championName;
  }

  /**
   * Get change category
   */
  public getCategory(): 'buffed' | 'nerfed' | 'adjusted' {
    return this.category;
  }

  /**
   * Get winrate delta
   */
  public getWinrateDelta(): PerformanceDelta {
    return this.winrateDelta;
  }

  /**
   * Get pickrate delta
   */
  public getPickrateDelta(): PerformanceDelta {
    return this.pickrateDelta;
  }

  /**
   * Get banrate delta
   */
  public getBanrateDelta(): PerformanceDelta {
    return this.banrateDelta;
  }

  /**
   * Check if this change is significant across all metrics
   */
  public isSignificantChange(): boolean {
    return (
      this.winrateDelta.isSignificant() ||
      this.pickrateDelta.isSignificant() ||
      this.banrateDelta.isSignificant()
    );
  }

  /**
   * Get summary string
   */
  public getSummary(): string {
    return `${this.championName} (${this.category}): WR ${this.winrateDelta.toString()}, ` +
           `PR ${this.pickrateDelta.toString()}, BR ${this.banrateDelta.toString()}`;
  }
}
