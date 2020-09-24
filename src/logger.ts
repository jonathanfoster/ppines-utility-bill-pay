import * as winston from 'winston';
import config from './config';

export const logger = winston.createLogger({
  level: config.ppines.logLevel,
  format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
  transports: [new winston.transports.Console()],
});

if (config.ppines.env !== 'production') {
  logger.format = winston.format.simple();
}

export default logger;
