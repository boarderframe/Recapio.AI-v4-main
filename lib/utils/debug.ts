import chalk from 'chalk';

const createLogger = (prefix: string, color: chalk.ChalkFunction) => ({
  info: (...args: any[]) => console.log(color(`[${prefix}]`), ...args),
  error: (...args: any[]) => console.error(chalk.red(`[${prefix} ERROR]`), ...args),
  warn: (...args: any[]) => console.warn(chalk.yellow(`[${prefix} WARN]`), ...args),
  debug: (...args: any[]) => console.debug(chalk.gray(`[${prefix} DEBUG]`), ...args),
});

export const log = {
  auth: createLogger('Auth', chalk.blue),
  nav: createLogger('Navigation', chalk.green),
  store: createLogger('Store', chalk.magenta),
  middleware: createLogger('Middleware', chalk.cyan),
}; 