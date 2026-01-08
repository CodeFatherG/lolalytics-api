import { LoLalyticsConfig } from './types.js';

/**
 * Default configuration values
 * Per spec requirements:
 * - FR-021: 5 second timeout
 * - FR-022: 2 retries with exponential backoff
 * - FR-023: 10 requests/second rate limiting
 * - FR-025: Silent logging by default
 */
export const DEFAULT_CONFIG: Required<LoLalyticsConfig> = {
  http: {
    timeoutMs: 5000, // 5 seconds
    maxRetries: 2,
    maxRequestsPerSecond: 10,
  },
  logging: {
    enabled: false, // Silent by default
    level: 'info',
    customLogger: undefined,
  },
};

/**
 * Merge user configuration with defaults
 */
export function mergeConfig(
  userConfig?: LoLalyticsConfig
): Required<LoLalyticsConfig> {
  if (!userConfig) {
    return DEFAULT_CONFIG;
  }

  return {
    http: {
      ...DEFAULT_CONFIG.http,
      ...userConfig.http,
    },
    logging: {
      ...DEFAULT_CONFIG.logging,
      ...userConfig.logging,
    },
  };
}
