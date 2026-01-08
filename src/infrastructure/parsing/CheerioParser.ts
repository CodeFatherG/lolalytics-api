import * as cheerio from 'cheerio';
import { ParsingError } from '../../domain/shared/errors/ParsingError.js';

/**
 * CheerioParser - Utility for HTML parsing using cheerio
 * Provides helper methods for safe element extraction with error handling
 */
export class CheerioParser {
  /**
   * Load HTML string into cheerio
   */
  public static load(html: string): cheerio.CheerioAPI {
    return cheerio.load(html);
  }

  /**
   * Safely extract text content from a selector
   * @param $ - Cheerio instance
   * @param selector - CSS selector or XPath
   * @param url - Source URL for error context
   * @param context - Description of what we're trying to extract
   * @returns Trimmed text content
   * @throws ParsingError if element not found
   */
  public static extractText(
    $: cheerio.CheerioAPI,
    selector: string,
    url: string,
    context: string
  ): string {
    const element = $(selector);

    if (element.length === 0) {
      throw ParsingError.forMissingElement(url, selector, context);
    }

    return element.text().trim();
  }

  /**
   * Safely extract text content from a selector, returning null if not found
   * @param $ - Cheerio instance
   * @param selector - CSS selector or XPath
   * @returns Trimmed text content or null
   */
  public static extractTextOptional(
    $: cheerio.CheerioAPI,
    selector: string
  ): string | null {
    const element = $(selector);

    if (element.length === 0) {
      return null;
    }

    return element.text().trim();
  }

  /**
   * Safely extract attribute value from a selector
   * @param $ - Cheerio instance
   * @param selector - CSS selector or XPath
   * @param attribute - Attribute name to extract
   * @param url - Source URL for error context
   * @param context - Description of what we're trying to extract
   * @returns Attribute value
   * @throws ParsingError if element not found or attribute missing
   */
  public static extractAttribute(
    $: cheerio.CheerioAPI,
    selector: string,
    attribute: string,
    url: string,
    context: string
  ): string {
    const element = $(selector);

    if (element.length === 0) {
      throw ParsingError.forMissingElement(url, selector, context);
    }

    const value = element.attr(attribute);

    if (value === undefined) {
      throw ParsingError.forInvalidData(
        url,
        context,
        `attribute "${attribute}"`,
        'undefined'
      );
    }

    return value;
  }

  /**
   * Count number of elements matching a selector
   * @param $ - Cheerio instance
   * @param selector - CSS selector or XPath
   * @returns Number of matching elements
   */
  public static countElements(
    $: cheerio.CheerioAPI,
    selector: string
  ): number {
    return $(selector).length;
  }
}
