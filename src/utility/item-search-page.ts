import * as puppeteer from 'puppeteer';
import BasePage from '../base-page';
import config from '../config';

export class ItemSearchPage extends BasePage {
  accountNo = '';
  accountNoSelector = 'input[name="ItemSearchQuestionUserInput[0].QuestionAnswer"]';
  houseNo = '';
  houseNoSelector = 'input[name="ItemSearchQuestionUserInput[1].QuestionAnswer"]';

  constructor(page: puppeteer.Page, url: string | null) {
    super(page);
    this.url = url || config.url;
  }

  async submit(): Promise<void> {
    await this.page.waitForSelector(this.submitSelector);
    await this.page.type(this.accountNoSelector, this.accountNo);
    await this.page.type(this.houseNoSelector, this.houseNo);
    return super.submit();
  }
}
