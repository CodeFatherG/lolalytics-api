import Bottleneck from 'bottleneck';

/**
 * RateLimiter - Implements request rate limiting using Bottleneck
 * Per spec FR-023: Maximum 10 requests per second to LoLalytics
 */
export class RateLimiter {
  private readonly limiter: Bottleneck;

  constructor(maxRequestsPerSecond: number = 10) {
    // Create bottleneck limiter with token bucket algorithm
    this.limiter = new Bottleneck({
      reservoir: maxRequestsPerSecond, // Initial tokens
      reservoirRefreshAmount: maxRequestsPerSecond, // Tokens to add
      reservoirRefreshInterval: 1000, // Refresh every 1 second
      maxConcurrent: maxRequestsPerSecond, // Max concurrent requests
      minTime: Math.floor(1000 / maxRequestsPerSecond), // Min time between requests
    });
  }

  /**
   * Schedule an operation to run with rate limiting
   * @param operation - Operation to execute
   * @returns Promise that resolves when operation completes
   */
  public async schedule<T>(operation: () => Promise<T>): Promise<T> {
    return this.limiter.schedule(operation);
  }

  /**
   * Get current limiter counts (for debugging/monitoring)
   */
  public getCounts(): Bottleneck.Counts {
    return this.limiter.counts();
  }
}
