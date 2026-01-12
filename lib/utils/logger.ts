/**
 * Internal logger configuration
 */
interface LoggerConfig {
  enabled: boolean;
}

let loggerConfig: LoggerConfig = {
  enabled: false,
};

/**
 * Configure logging for react-use-anywhere
 * Call this at the start of your application to enable/disable logs
 * 
 * @example
 * ```typescript
 * import { configureLogging } from 'react-use-anywhere';
 * 
 * // Enable logging (useful for debugging)
 * configureLogging({ enabled: true });
 * 
 * // Disable logging (default, recommended for production)
 * configureLogging({ enabled: false });
 * ```
 */
export function configureLogging(config: Partial<LoggerConfig>): void {
  loggerConfig = { ...loggerConfig, ...config };
}

/**
 * Get current logger configuration
 */
export function getLoggerConfig(): LoggerConfig {
  return { ...loggerConfig };
}

/**
 * Internal logging utilities
 */
export const logger = {
  log(...args: unknown[]): void {
    if (loggerConfig.enabled && process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },

  warn(...args: unknown[]): void {
    if (loggerConfig.enabled && process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
  },

  error(...args: unknown[]): void {
    if (loggerConfig.enabled && process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  },
};
