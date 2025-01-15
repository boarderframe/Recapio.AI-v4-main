// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug'
}

// Log namespaces
export enum LogNamespace {
  SYSTEM = 'system',
  AUTH = 'auth',
  API = 'api',
  DB = 'db',
  MIDDLEWARE = 'middleware',
  UI = 'ui'
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  namespace: LogNamespace;
  message: string;
  meta?: Record<string, any>;
}

// Logger interface
interface ILogger {
  error: (message: string, meta?: Record<string, any>) => void;
  warn: (message: string, meta?: Record<string, any>) => void;
  info: (message: string, meta?: Record<string, any>) => void;
  http: (message: string, meta?: Record<string, any>) => void;
  debug: (message: string, meta?: Record<string, any>) => void;
}

// Default no-op logger
const noopLogger: ILogger = {
  error: () => {},
  warn: () => {},
  info: () => {},
  http: () => {},
  debug: () => {}
};

// Server-side logs storage
let logs: LogEntry[] = [];
const MAX_LOGS = 1000;

class Logger {
  private static instance: Logger | null = null;
  private loggers: Record<LogNamespace, ILogger>;
  private initialized = false;

  private constructor() {
    this.loggers = {} as Record<LogNamespace, ILogger>;
  }

  private initialize() {
    if (this.initialized) return;
    
    Object.values(LogNamespace).forEach((namespace) => {
      this.loggers[namespace as LogNamespace] = this.createNamespacedLogger(namespace as LogNamespace);
    });
    
    this.initialized = true;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return '#ff0000';
      case LogLevel.WARN:
        return '#ffa500';
      case LogLevel.INFO:
        return '#00ff00';
      case LogLevel.HTTP:
        return '#00bfff';
      default:
        return '#808080';
    }
  }

  private formatLogMessage(namespace: LogNamespace, level: LogLevel, message: string, meta?: Record<string, any>): string {
    return `[${namespace}] ${level.toUpperCase()}: ${message}${meta ? ' ' + JSON.stringify(meta) : ''}`;
  }

  private log(namespace: LogNamespace, level: LogLevel, message: string, meta?: Record<string, any>) {
    if (!this.initialized) {
      this.initialize();
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      namespace,
      message,
      meta
    };

    // Format the log message
    const formattedMessage = this.formatLogMessage(namespace, level, message, meta);

    // Store in memory
    logs.push(entry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }

    // Console logging
    if (typeof window !== 'undefined') {
      // Browser-side logging
      const color = this.getLogColor(level);
      console.log(
        `%c${entry.timestamp} ${formattedMessage}`,
        `color: ${color}`
      );

      // Send to API endpoint
      try {
        fetch('/api/debug/logs', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(entry),
        }).catch(() => {
          if (process.env.NODE_ENV === 'development') {
            console.debug('Failed to send log to API');
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Error sending log to API:', error);
        }
      }
    } else {
      // Server-side logging
      console.log(`${entry.timestamp} ${formattedMessage}`);
    }
  }

  private createNamespacedLogger(namespace: LogNamespace): ILogger {
    return {
      error: (message: string, meta?: Record<string, any>) => 
        this.log(namespace, LogLevel.ERROR, message, meta),
      warn: (message: string, meta?: Record<string, any>) => 
        this.log(namespace, LogLevel.WARN, message, meta),
      info: (message: string, meta?: Record<string, any>) => 
        this.log(namespace, LogLevel.INFO, message, meta),
      http: (message: string, meta?: Record<string, any>) => 
        this.log(namespace, LogLevel.HTTP, message, meta),
      debug: (message: string, meta?: Record<string, any>) => {
        if (process.env.NODE_ENV === 'development') {
          this.log(namespace, LogLevel.DEBUG, message, meta);
        }
      }
    };
  }

  public getLogger(namespace: LogNamespace): ILogger {
    if (!this.initialized) {
      this.initialize();
    }
    
    return this.loggers[namespace];
  }
}

// Create a proxy to handle lazy initialization of loggers
const createLoggerProxy = (namespace: LogNamespace): ILogger => {
  return new Proxy(noopLogger, {
    get: (target, prop: keyof ILogger) => {
      return (message: string, meta?: Record<string, any>) => 
        Logger.getInstance().getLogger(namespace)[prop](message, meta);
    }
  });
};

// Export singleton instance methods with lazy initialization
export const getLogs = () => logs;
export const clearLogs = () => { logs = []; };

// Export namespaced loggers with lazy initialization
export const log = {
  system: createLoggerProxy(LogNamespace.SYSTEM),
  auth: createLoggerProxy(LogNamespace.AUTH),
  api: createLoggerProxy(LogNamespace.API),
  db: createLoggerProxy(LogNamespace.DB),
  middleware: createLoggerProxy(LogNamespace.MIDDLEWARE),
  ui: createLoggerProxy(LogNamespace.UI)
}; 