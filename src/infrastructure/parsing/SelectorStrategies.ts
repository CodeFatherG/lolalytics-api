/**
 * SelectorStrategies - Helper for building robust CSS selectors with fallback strategies
 * Per Constitution Principle IV: Resilient parsing with fallback strategies
 */
export class SelectorStrategies {
  /**
   * Build a selector for tier list rows
   * Primary: by row index in main container
   * @param rowIndex - 1-based row index
   */
  public static tierListRow(rowIndex: number): string {
    // Matches Python implementation: /html/body/main/div[6]/div[{i}]/div[column]
    // In cheerio: main > div:nth-of-type(6) > div:nth-of-type({i})
    return `main > div:nth-of-type(6) > div:nth-of-type(${rowIndex})`;
  }

  /**
   * Build selector for tier list rank column
   */
  public static tierListRank(rowIndex: number): string {
    return `${SelectorStrategies.tierListRow(rowIndex)} > div:nth-of-type(1)`;
  }

  /**
   * Build selector for tier list champion name column
   */
  public static tierListChampion(rowIndex: number): string {
    return `${SelectorStrategies.tierListRow(rowIndex)} > div:nth-of-type(3) a`;
  }

  /**
   * Build selector for tier list tier column
   */
  public static tierListTier(rowIndex: number): string {
    return `${SelectorStrategies.tierListRow(rowIndex)} > div:nth-of-type(4)`;
  }

  /**
   * Build selector for tier list winrate column
   */
  public static tierListWinrate(rowIndex: number): string {
    return `${SelectorStrategies.tierListRow(rowIndex)} > div:nth-of-type(6) > div > span:nth-of-type(1)`;
  }

  /**
   * Build selector for champion data statistics
   * Matches Python implementation: /html/body/main/div[5]/div[1]/div[2]/div[2]/div[row]/div[col]/div[1]
   */
  public static championDataStat(row: number, col: number): string {
    return `main > div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(${row}) > div:nth-of-type(${col}) > div:nth-of-type(1)`;
  }

  /**
   * Build selector for counter champion card
   * @param counterIndex - 1-based index of counter
   */
  public static counterCard(counterIndex: number): string {
    return `main > div:nth-of-type(6) > div:nth-of-type(1) > div:nth-of-type(2) > span:nth-of-type(${counterIndex})`;
  }

  /**
   * Build selector for counter champion name
   */
  public static counterName(counterIndex: number): string {
    return `${SelectorStrategies.counterCard(counterIndex)} > div:nth-of-type(1) > a > div > div:nth-of-type(1)`;
  }

  /**
   * Build selector for counter winrate
   */
  public static counterWinrate(counterIndex: number): string {
    return `${SelectorStrategies.counterCard(counterIndex)} > div:nth-of-type(1) > a > div > div:nth-of-type(2) > div`;
  }

  /**
   * Build selector for matchup winrate
   * Matches Python: /html/body/main/div[5]/div[1]/div[2]/div[3]/div/div/div[1]/div[1]
   */
  public static matchupWinrate(): string {
    return `main > div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > div > div > div:nth-of-type(1) > div:nth-of-type(1)`;
  }

  /**
   * Build selector for matchup number of games
   */
  public static matchupGames(): string {
    return `main > div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > div > div > div:nth-of-type(2) > div:nth-of-type(1)`;
  }

  /**
   * Build selector for patch notes champion in a category
   * @param categoryIndex - 1-based category index (1=buffed, 2=nerfed, 3=adjusted)
   * @param championIndex - 1-based champion index within category
   */
  public static patchNotesChampion(
    categoryIndex: number,
    championIndex: number
  ): string {
    return `main > div:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(${categoryIndex}) > div > div:nth-of-type(${championIndex})`;
  }

  /**
   * Build selector for patch notes champion name
   */
  public static patchNotesName(
    categoryIndex: number,
    championIndex: number
  ): string {
    return `${SelectorStrategies.patchNotesChampion(categoryIndex, championIndex)} > div > div:nth-of-type(1) > span:nth-of-type(1) > a`;
  }

  /**
   * Build selector for patch notes winrate delta
   */
  public static patchNotesWinrate(
    categoryIndex: number,
    championIndex: number
  ): string {
    return `${SelectorStrategies.patchNotesChampion(categoryIndex, championIndex)} > div > div:nth-of-type(2) > span`;
  }

  /**
   * Build selector for patch notes pickrate delta
   */
  public static patchNotesPickrate(
    categoryIndex: number,
    championIndex: number
  ): string {
    return `${SelectorStrategies.patchNotesChampion(categoryIndex, championIndex)} > div > div:nth-of-type(3) > span:nth-of-type(1)`;
  }

  /**
   * Build selector for patch notes banrate delta
   */
  public static patchNotesBanrate(
    categoryIndex: number,
    championIndex: number
  ): string {
    return `${SelectorStrategies.patchNotesChampion(categoryIndex, championIndex)} > div > div:nth-of-type(3) > span:nth-of-type(2)`;
  }
}
