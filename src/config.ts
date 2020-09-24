import * as dotenv from 'dotenv';

dotenv.config();

export interface Config {
  accountNo: string;
  env: string;
  houseNo: string;
  logLevel: string;
  url: string;
}

export const config: Config = {
  accountNo: process.env.PPINES_ACCOUNT_NO || '',
  env: process.env.PPINES_ENV || 'development',
  houseNo: process.env.PPINES_HOUSE_NO || '',
  logLevel: process.env.PPINES_LOG_LEVEL || process.env.LOG_LEVEL || 'info',
  url: process.env.PPINES_URL || 'https://www.ppines.com',
};

export default config;
