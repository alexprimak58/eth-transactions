import { appendFileSync } from 'fs';
import { Logger } from 'tslog';

export function makeLogger(name: string) {
  const logger = new Logger({
    hideLogPositionForProduction: true,
    name: name,
    prettyLogTemplate:
      '{{dd}}.{{mm}} {{hh}}:{{MM}}:{{ss}}\t{{logLevelName}}\t{{name}}\t',
  });

  logger.attachTransport((logObj) => {
    appendFileSync('./log.txt', JSON.stringify(logObj) + '\n');
  });

  return logger;
}
