import * as uuid from 'uuid';
import * as puppeteer from 'puppeteer';
import config from './config';
import logger from './logger';

export class BaseProcess {
  browser: puppeteer.Browser | null = null;
  page: puppeteer.Page | null = null;
  processName: string;
  sessionId: string;

  constructor(processName: string) {
    this.processName = processName;
    this.sessionId = uuid.v4();
  }

  async launchBrowser(): Promise<null> {
    logger.info('Launching browser.');
    if (!config.headless) {
      logger.warn('Disabling headless browser mode.');
    }

    if (config.slowmo > 0) {
      logger.warn(`Slowing down browser operations by ${config.slowmo} ms.`);
    }

    this.browser = await puppeteer.launch({ headless: config.headless, slowMo: config.slowmo });
    this.page = await this.browser.newPage();

    if (config.timeout !== 30000) {
      logger.warn(`Setting page default timeout and default navigation timeout to ${config.timeout} ms.`);
    }

    await this.page.setDefaultNavigationTimeout(config.timeout);
    await this.page.setDefaultTimeout(config.timeout);
    await this.page.setViewport({ width: 1024, height: 768 });

    return null;
  }
}
