/**
 * Configuration types for the LoLalytics API library
 */

import { Logger } from '../infrastructure/logging/Logger.js';

/**
 * HTTP client configuration
 */
export interface HttpConfig {
  /**
   * Request timeout in milliseconds (default: 5000ms per spec FR-021)
   */
  timeoutMs?: number;

  /**
   * Maximum number of retries (default: 2 per spec FR-022)
   */
  maxRetries?: number;

  /**
   * Maximum requests per second (default: 10 per spec FR-023)
   */
  maxRequestsPerSecond?: number;
}

/**
 * Logging configuration
 */
export interface LoggingConfig {
  /**
   * Enable logging (default: false per spec FR-025 - silent by default)
   */
  enabled?: boolean;

  /**
   * Log level (default: 'info')
   */
  level?: 'error' | 'warn' | 'info' | 'debug';

  /**
   * Custom logger implementation (optional)
   */
  customLogger?: Logger;
}

/**
 * Main library configuration
 */
export interface LoLalyticsConfig {
  /**
   * HTTP client configuration
   */
  http?: HttpConfig;

  /**
   * Logging configuration
   */
  logging?: LoggingConfig;
}
