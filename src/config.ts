import * as dotenv from 'dotenv';

dotenv.config();

export interface Config {
  accountNo: string;
  env: string;
  headless: boolean;
  houseNo: string;
  logLevel: string;
  screenshot: boolean;
  screenshotOutput: string;
  slowmo: number;
  timeout: number;
  url: string;
}

export const config: Config = {
  accountNo: process.env.PPINES_ACCOUNT_NO || '',
  env: process.env.PPINES_ENV || 'development',
  headless: !process.env.PPINES_DISABLE_HEADLESS,
  houseNo: process.env.PPINES_HOUSE_NO || '',
  logLevel: process.env.PPINES_LOG_LEVEL || process.env.LOG_LEVEL || 'info',
  screenshot: !!process.env.PPINES_SCREENSHOT,
  screenshotOutput: process.env.PPINES_SCREENSHOT_OUTPUT || '',
  slowmo: parseInt(process.env.PPINES_SLOWMO || '0', 10),
  timeout: parseInt(process.env.PPINES_TIMEOUT || '30000', 10),
  url: process.env.PPINES_URL || 'https://www.ppines.com',
};

export default config;
