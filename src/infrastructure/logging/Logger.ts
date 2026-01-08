/**
 * Logger interface - Abstraction for logging implementation
 * Per spec FR-024: Optional structured logging with configurable log levels
 */
export interface Logger {
  error(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

/**
 * Silent logger - Default implementation that does nothing
 * Per spec FR-025: Silent logging by default unless explicitly enabled
 */
export class SilentLogger implements Logger {
  error(_message: string, _context?: Record<string, unknown>): void {
    // Silent - no output
  }

  warn(_message: string, _context?: Record<string, unknown>): void {
    // Silent - no output
  }

  info(_message: string, _context?: Record<string, unknown>): void {
    // Silent - no output
  }

  debug(_message: string, _context?: Record<string, unknown>): void {
    // Silent - no output
  }
}
