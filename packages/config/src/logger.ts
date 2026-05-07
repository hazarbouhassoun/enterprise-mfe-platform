export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type Logger = {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  child: (scope: string) => Logger;
};

const format =
  (level: LogLevel, scope: string) =>
  (...args: unknown[]) => {
    const ts = new Date().toISOString();
    const line = `[${ts}] [${level.toUpperCase()}] [${scope}]`;
    // Structured for future APM / log drains (Datadog, OTEL, etc.)
    if (level === 'error') {
      console.error(line, ...args);
      return;
    }
    if (level === 'warn') {
      console.warn(line, ...args);
      return;
    }
    if (process.env.NODE_ENV !== 'production' || level === 'info') {
      if (level === 'debug') {
        console.debug(line, ...args);
      } else {
        console.info(line, ...args);
      }
    }
  };

/**
 * Creates a namespaced logger. Swap implementation at build time to forward to
 * OpenTelemetry / vendor SDKs without changing call sites.
 */
export function createLogger(scope: string): Logger {
  const base = scope || 'app';
  return {
    debug: format('debug', base),
    info: format('info', base),
    warn: format('warn', base),
    error: format('error', base),
    child: (childScope: string) => createLogger(`${base}:${childScope}`),
  };
}
