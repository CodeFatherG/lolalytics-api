import { request } from 'undici';
import { NetworkError } from '../../domain/shared/errors/NetworkError.js';
import { RetryStrategy } from './RetryStrategy.js';
import { RateLimiter } from './RateLimiter.js';
import { Logger, SilentLogger } from '../logging/Logger.js';

/**
 * HttpClient - HTTP client with timeout, retry, and rate limiting
 * Per spec FR-021: 5 second timeout
 * Per spec FR-022: 2 retries with exponential backoff
 * Per spec FR-023: 10 requests/second rate limiting
 */
export class HttpClient {
  private static readonly TIMEOUT_MS = 5000; // 5 seconds
  private readonly rateLimiter: RateLimiter;
  private readonly logger: Logger;

  constructor(rateLimiter: RateLimiter, logger: Logger = new SilentLogger()) {
    this.rateLimiter = rateLimiter;
    this.logger = logger;
  }

  /**
   * Fetch HTML content from a URL with timeout, retry, and rate limiting
   * @param url - URL to fetch
   * @returns HTML content as string
   * @throws NetworkError if request fails after all retries
   */
  public async fetchHtml(url: string): Promise<string> {
    this.logger.debug('Fetching URL', { url });

    // Rate limit the request
    return this.rateLimiter.schedule(async () => {
      // Execute with retry strategy
      const { result, attempts } = await RetryStrategy.executeWithRetry(
        async () => {
          try {
            const response = await request(url, {
              method: 'GET',
              headersTimeout: HttpClient.TIMEOUT_MS,
              bodyTimeout: HttpClient.TIMEOUT_MS,
            });

            // Check for HTTP errors
            if (response.statusCode >= 400) {
              throw NetworkError.forHttpError(url, response.statusCode, 0);
            }

            // Read response body
            const body = await response.body.text();
            return body;
          } catch (error) {
            // If it's already a NetworkError, rethrow it
            if (error instanceof NetworkError) {
              throw error;
            }

            // Check if it's a timeout error
            if (error instanceof Error && error.message.includes('timeout')) {
              throw NetworkError.forTimeout(url, 0);
            }

            // General request failure
            throw NetworkError.forRequestFailure(url, 0, error as Error);
          }
        },
        `fetch ${url}`
      );

      if (attempts > 0) {
        this.logger.info('Request succeeded after retries', {
          url,
          attempts,
        });
      } else {
        this.logger.debug('Request succeeded on first attempt', { url });
      }

      return result;
    });
  }
}
