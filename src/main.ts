import * as puppeteer from 'puppeteer';
import config from './config';
import logger from './logger';
import { ItemSearchPage } from './utility/item-search-page';
import { SelectItemsPage } from './utility/select-items-page';

async function main(): Promise<number> {
  logger.info('Starting PPines utility bill pay process session.');

  if (!config.accountNo) {
    logger.error('Account number not provided.');
    return 1;
  }

  if (!config.houseNo) {
    logger.error('House number not provided.');
    return 1;
  }

  logger.info('Launching browser.');

  if (!config.headless) {
    logger.warn('Disabling headless browser mode.');
  }

  if (config.slowmo > 0) {
    logger.warn(`Slowing down browser operations by ${config.slowmo} ms.`);
  }

  const browser = await puppeteer.launch({ headless: config.headless, slowMo: config.slowmo });
  const page = await browser.newPage();

  if (config.timeout !== 30000) {
    logger.warn(`Setting page default timeout and default navigation timeout to ${config.timeout} ms.`);
  }

  await page.setDefaultNavigationTimeout(config.timeout);
  await page.setDefaultTimeout(config.timeout);
  await page.setViewport({ width: 1024, height: 768 });

  logger.info(`Navigating to PPines URL ${config.url}.`);
  const itemSearchPage = new ItemSearchPage(page, config.url);
  await itemSearchPage.goto();

  logger.info('Entering account number and house number.');
  itemSearchPage.accountNo = config.accountNo;
  itemSearchPage.houseNo = config.houseNo;
  await itemSearchPage.submit();

  logger.info('Parsing line items.');
  const selectItemsPage = new SelectItemsPage(page);
  await selectItemsPage.parseLineItems();

  if (selectItemsPage.lineItems.length === 0) {
    logger.warn('No line items found.');
    return 0;
  }

  const lineItem = selectItemsPage.lineItems[0];

  logger.info('Verifying account number.');
  if (lineItem.accountNo !== config.accountNo) {
    logger.error('Unable to verify account number on select items page.');
    return 1;
  }

  logger.info(`Amount owed is $${lineItem.amountOwed}.`);
  logger.info(`Submitting payment amount of $${lineItem.paymentAmount}.`);
  await selectItemsPage.submit();

  logger.info('Closing browser.');
  await browser.close();
  return 0;
}

main()
  .then((code: number) => {
    if (code === 0) {
      logger.info('PPines utility bill pay process completed successfully.');
    } else {
      logger.warn('PPines utility bill pay process completed with errors.');
    }

    process.exit(code);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
