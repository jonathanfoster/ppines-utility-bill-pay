import * as dotenv from 'dotenv';

dotenv.config();

export interface Config {
  ppines: {
    env: string;
    logLevel: string;
  };
}

export const config: Config = {
  ppines: {
    env: process.env.PPINES_ENV || 'development',
    logLevel: process.env.PPINES_LOG_LEVEL || process.env.LOG_LEVEL || 'info',
  },
};

export default config;
