/**
 * RetryStrategy - Implements exponential backoff retry logic
 * Per spec FR-022: Maximum 2 retries with exponential backoff (delays: 1s, 2s)
 */
export class RetryStrategy {
  private static readonly MAX_RETRIES = 2;
  private static readonly RETRY_DELAYS_MS = [1000, 2000]; // 1s, 2s

  /**
   * Execute an operation with retry logic
   * @param operation - Async operation to execute
   * @param operationName - Name for logging/error context
   * @returns Result of the operation
   * @throws Last error if all retries fail
   */
  public static async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{ result: T; attempts: number }> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= RetryStrategy.MAX_RETRIES; attempt++) {
      try {
        const result = await operation();
        return { result, attempts: attempt };
      } catch (error) {
        lastError = error as Error;

        // If this was the last attempt, throw the error
        if (attempt === RetryStrategy.MAX_RETRIES) {
          throw lastError;
        }

        // Wait before retrying (exponential backoff)
        const delayMs = RetryStrategy.RETRY_DELAYS_MS[attempt];
        await RetryStrategy.delay(delayMs);
      }
    }

    // This should never be reached due to the throw above, but TypeScript needs it
    throw lastError ?? new Error(`${operationName} failed after all retries`);
  }

  /**
   * Delay execution for specified milliseconds
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get the maximum number of retry attempts
   */
  public static getMaxRetries(): number {
    return RetryStrategy.MAX_RETRIES;
  }
}
