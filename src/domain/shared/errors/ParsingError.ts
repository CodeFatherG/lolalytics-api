/**
 * ParsingError - Thrown when HTML parsing fails or expected elements are not found
 * Per spec FR-012: Graceful handling with descriptive errors including selector context
 */
export class ParsingError extends Error {
  public readonly url: string;
  public readonly selector?: string;
  public readonly context?: string;

  constructor(
    message: string,
    url: string,
    selector?: string,
    context?: string
  ) {
    super(message);
    this.name = 'ParsingError';
    this.url = url;
    this.selector = selector;
    this.context = context;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParsingError);
    }
  }

  /**
   * Create a ParsingError for a missing element
   */
  public static forMissingElement(
    url: string,
    selector: string,
    context: string
  ): ParsingError {
    return new ParsingError(
      `Failed to find expected element. Selector: "${selector}". Context: ${context}. URL: ${url}. ` +
      `This may indicate that LoLalytics has changed their HTML structure.`,
      url,
      selector,
      context
    );
  }

  /**
   * Create a ParsingError for unexpected HTML structure
   */
  public static forUnexpectedStructure(
    url: string,
    context: string,
    details?: string
  ): ParsingError {
    const message = details
      ? `Unexpected HTML structure: ${details}. Context: ${context}. URL: ${url}`
      : `Unexpected HTML structure in ${context}. URL: ${url}`;

    return new ParsingError(message, url, undefined, context);
  }

  /**
   * Create a ParsingError for invalid data format
   */
  public static forInvalidData(
    url: string,
    context: string,
    expectedFormat: string,
    actualValue: string
  ): ParsingError {
    return new ParsingError(
      `Invalid data format. Expected: ${expectedFormat}, Got: "${actualValue}". Context: ${context}. URL: ${url}`,
      url,
      undefined,
      context
    );
  }
}
