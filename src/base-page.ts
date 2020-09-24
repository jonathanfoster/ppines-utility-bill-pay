import * as puppeteer from 'puppeteer';
import * as uuid from 'uuid';
import config from './config';

export class BasePage {
  page: puppeteer.Page;
  screenshotEnabled: boolean;
  screenshotOutput: string;
  submitSelector = 'input[type="submit"]';
  url: string | null = null;

  constructor(page: puppeteer.Page) {
    this.page = page;
    this.screenshotEnabled = config.screenshot;
    this.screenshotOutput = config.screenshotOutput;
  }

  async goto(): Promise<puppeteer.Response | null> {
    if (this.url === null) {
      return null;
    }

    await this.page.goto(this.url);
    await this.screenshot();
    return null;
  }

  async screenshot(filename: string | null = null): Promise<Buffer | null> {
    if (this.screenshotEnabled) {
      const screenshotFilename = filename !== null ? filename : `${uuid.v4()}.png`;
      return this.page.screenshot({ path: `${this.screenshotOutput}/${screenshotFilename}` });
    }

    return null;
  }

  async submit(): Promise<void> {
    await this.screenshot();
    return this.page.click(this.submitSelector);
  }
}

export default BasePage;
