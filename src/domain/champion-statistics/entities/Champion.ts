/**
 * Champion entity - Core domain object with identity
 * Per DDD: Entities have unique identity that persists across state changes
 */
export class Champion {
  private readonly name: string;
  private readonly lane?: string;

  private constructor(name: string, lane?: string) {
    this.name = name;
    this.lane = lane;
  }

  /**
   * Create a Champion entity
   * @param name - Champion name (unique identifier)
   * @param lane - Optional lane/role specification
   * @returns Champion instance
   */
  public static create(name: string, lane?: string): Champion {
    if (!name || name.trim() === '') {
      throw new Error('Champion name cannot be empty');
    }

    return new Champion(name.trim().toLowerCase(), lane);
  }

  /**
   * Get the champion's name (unique identifier)
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Get the champion's lane if specified
   */
  public getLane(): string | undefined {
    return this.lane;
  }

  /**
   * Get the champion's display name (capitalized)
   */
  public getDisplayName(): string {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }

  /**
   * Check equality based on identity (name)
   */
  public equals(other: Champion): boolean {
    return this.name === other.name;
  }
}
