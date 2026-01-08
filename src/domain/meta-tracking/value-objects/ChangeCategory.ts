/**
 * ChangeCategory value object - Immutable category classification (buffed/nerfed/adjusted)
 */
export class ChangeCategory {
  private static readonly VALID_CATEGORIES = ['buffed', 'nerfed', 'adjusted', 'all'] as const;

  private readonly value: typeof ChangeCategory.VALID_CATEGORIES[number];

  private constructor(value: typeof ChangeCategory.VALID_CATEGORIES[number]) {
    this.value = value;
  }

  /**
   * Create a ChangeCategory from a string
   * @param category - Category string (buffed, nerfed, adjusted, or all)
   * @returns ChangeCategory instance
   * @throws Error if category is invalid
   */
  public static from(category: string): ChangeCategory {
    const lowerCategory = category.toLowerCase().trim();

    if (!ChangeCategory.isValidCategory(lowerCategory)) {
      throw new Error(
        `Invalid category: "${category}". Valid categories: ${ChangeCategory.VALID_CATEGORIES.join(', ')}`
      );
    }

    return new ChangeCategory(lowerCategory as typeof ChangeCategory.VALID_CATEGORIES[number]);
  }

  /**
   * Check if a string is a valid category
   */
  private static isValidCategory(
    category: string
  ): category is typeof ChangeCategory.VALID_CATEGORIES[number] {
    return (ChangeCategory.VALID_CATEGORIES as readonly string[]).includes(category);
  }

  /**
   * Get the category as a string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Check if this category requires fetching all categories
   */
  public isAll(): boolean {
    return this.value === 'all';
  }

  /**
   * Get categories to fetch (returns array for 'all', single element otherwise)
   */
  public getCategoriesToFetch(): Array<'buffed' | 'nerfed' | 'adjusted'> {
    if (this.isAll()) {
      return ['buffed', 'nerfed', 'adjusted'];
    }
    return [this.value as 'buffed' | 'nerfed' | 'adjusted'];
  }
}
