/**
 * NetworkError - Thrown when HTTP requests fail after retries
 * Per spec FR-022: Includes retry context (URL, parameters, attempts)
 */
export class NetworkError extends Error {
  public readonly url: string;
  public readonly statusCode?: number;
  public readonly retryAttempts: number;
  public readonly originalError?: Error;

  constructor(
    message: string,
    url: string,
    retryAttempts: number,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
    this.url = url;
    this.statusCode = statusCode;
    this.retryAttempts = retryAttempts;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }

  /**
   * Create a NetworkError for a timeout
   */
  public static forTimeout(url: string, retryAttempts: number): NetworkError {
    return new NetworkError(
      `Request timed out after ${retryAttempts + 1} attempts (including ${retryAttempts} retries). URL: ${url}`,
      url,
      retryAttempts
    );
  }

  /**
   * Create a NetworkError for an HTTP error status
   */
  public static forHttpError(
    url: string,
    statusCode: number,
    retryAttempts: number
  ): NetworkError {
    return new NetworkError(
      `HTTP error ${statusCode} after ${retryAttempts + 1} attempts. URL: ${url}`,
      url,
      retryAttempts,
      statusCode
    );
  }

  /**
   * Create a NetworkError for a general request failure
   */
  public static forRequestFailure(
    url: string,
    retryAttempts: number,
    originalError: Error
  ): NetworkError {
    return new NetworkError(
      `Request failed after ${retryAttempts + 1} attempts: ${originalError.message}. URL: ${url}`,
      url,
      retryAttempts,
      undefined,
      originalError
    );
  }
}
