import * as winston from 'winston';
import config from './config';

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
  transports: [new winston.transports.Console()],
});

if (config.env !== 'production') {
  logger.format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()} ${info.message}`),
  );
}

export default logger;
