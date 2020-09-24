import * as puppeteer from 'puppeteer';
import * as uuid from 'uuid';
import config from './config';
import logger from './logger';

async function screenshot(page: puppeteer.Page, sessionId: string, filename: string): Promise<Buffer | null> {
  if (config.screenshot) {
    return page.screenshot({ path: `${config.screenshotOutput}/${sessionId}-${filename}` });
  }

  return null;
}

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

  const sessionId = uuid.v4();

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
  await page.goto(config.url);
  await screenshot(page, sessionId, 'item-search.png');

  logger.info('Entering account number and house number.');

  const accountNoSelector = 'input[name="ItemSearchQuestionUserInput[0].QuestionAnswer"]';
  const houseNoSelector = 'input[name="ItemSearchQuestionUserInput[1].QuestionAnswer"]';
  const submitSelector = 'input[type="submit"]';

  await page.waitForSelector(submitSelector);
  await page.type(accountNoSelector, config.accountNo);
  await page.type(houseNoSelector, config.houseNo);
  await screenshot(page, sessionId, 'item-search-submit.png');

  logger.info('Submitting item search.');
  await page.click(submitSelector);

  const lineItemSelector = 'tr.lineItemRow > td.lineItemTextCell > div';
  const paymentAmountSelector = 'input[name="CartUserInput.LineItems[0].SubFields[0].Value"]';

  await page.waitForSelector(submitSelector);
  await screenshot(page, sessionId, 'select-items.png');

  logger.info('Extracting line items.');
  const lineItem = await page.$$eval(lineItemSelector, (elements) =>
    elements.map((element) => (element as HTMLElement).innerText),
  );
  const paymentAmount = await page.$eval(paymentAmountSelector, (element) => (element as HTMLInputElement).value);

  const utilityBill = {
    accountNo: lineItem[0],
    serviceAddress: lineItem[1],
    name: lineItem[2],
    service: lineItem[3],
    amountOwed: lineItem[4],
    paymentAmount,
  };

  logger.info('Confirming account number.');
  if (utilityBill.accountNo !== config.accountNo) {
    logger.error('Unable to confirm account number on select items page.');
    return 1;
  }

  logger.info(`Amount owed is $${utilityBill.amountOwed}.`);
  logger.info(`Submitting payment amount of $${utilityBill.paymentAmount}.`);

  await screenshot(page, sessionId, 'select-items-submit.png');
  await page.click(submitSelector);

  await page.waitForSelector(submitSelector);
  await screenshot(page, sessionId, 'payment-entry.png');

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
