import pino from 'pino';
import { Logger } from './Logger.js';

/**
 * PinoLogger - High-performance structured logger implementation using pino
 * Per spec: Optional structured logging, silent by default
 */
export class PinoLogger implements Logger {
  private readonly pinoInstance: pino.Logger;

  constructor(level: 'error' | 'warn' | 'info' | 'debug' = 'info') {
    this.pinoInstance = pino({
      level,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.pinoInstance.error(context, message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.pinoInstance.warn(context, message);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.pinoInstance.info(context, message);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.pinoInstance.debug(context, message);
  }
}
