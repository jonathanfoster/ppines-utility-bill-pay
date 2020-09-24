import { BaseProcess } from '../base-process';
import config from '../config';
import logger from '../logger';
import { ItemSearchPage } from './item-search-page';
import { SelectItemsPage } from './select-items-page';

export class BillPayProcess extends BaseProcess {
  accountNo: string;
  houseNo: string;
  url: string;

  constructor(accountNo: string, houseNo: string, url: string | null = null) {
    super('Utility Bill Pay');
    this.accountNo = accountNo;
    this.houseNo = houseNo;
    this.url = url || config.url;
  }

  async run(): Promise<number> {
    await super.launchBrowser();

    if (this.browser === null || this.page === null) {
      logger.error('Failed to launch browser.');
      return 1;
    }

    logger.info(`Navigating to ${this.url}.`);
    const itemSearchPage = new ItemSearchPage(this.page, this.url);
    await itemSearchPage.goto();

    logger.info('Entering account number and house number.');
    itemSearchPage.accountNo = this.accountNo;
    itemSearchPage.houseNo = this.houseNo;
    await itemSearchPage.submit();

    logger.info('Parsing line items.');
    const selectItemsPage = new SelectItemsPage(this.page);
    await selectItemsPage.parseLineItems();

    if (selectItemsPage.lineItems.length === 0) {
      logger.warn('No line items found.');
      return 0;
    }

    const lineItem = selectItemsPage.lineItems[0];

    logger.info('Verifying account number.');
    if (lineItem.accountNo !== this.accountNo) {
      logger.error('Unable to verify account number on select items page.');
      return 1;
    }

    logger.info(`Amount owed is $${lineItem.amountOwed}.`);
    logger.info(`Submitting payment amount of $${lineItem.paymentAmount}.`);
    await selectItemsPage.submit();

    logger.info('Closing browser.');
    await this.browser.close();
    return 0;
  }
}

export default BillPayProcess;
