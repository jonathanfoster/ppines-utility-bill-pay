import * as puppeteer from 'puppeteer';
import config from './config';
import logger from './logger';

async function main(): Promise<number> {
  logger.info('Starting PPines utility bill pay process.');

  if (!config.accountNo) {
    logger.error('Account number not provided.');
    return 1;
  }

  if (!config.houseNo) {
    logger.error('House number not provided.');
    return 1;
  }

  logger.info('Launching browser.');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  logger.info(`Navigating to PPines URL ${config.url}.`);
  await page.goto(config.url);

  logger.info('Entering account number and house number.');
  await page.type('#ItemSearchQuestionUserInput_0__QuestionAnswer', config.accountNo);
  await page.type('#ItemSearchQuestionUserInput_1__QuestionAnswer', config.houseNo);
  await page.click('#SubmitButton');
  await page.waitForNavigation();

  logger.info('Extracting data.');
  const data = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('tr.lineItemRow > td.lineItemTextCell > div'));
    return cells.map((cell) => cell.innerHTML.replace('\n', '').trimStart().trimEnd());
  });

  const utilityBill = {
    accountNo: data[0],
    serviceAddress: data[1],
    name: data[2],
    service: data[3],
    amountOwed: data[4],
  };

  logger.info('Confirming account number.');
  if (utilityBill.accountNo !== config.accountNo) {
    logger.error('Unable to confirm account number on select items page.');
    return 1;
  }

  logger.info(`Amount owed is $${utilityBill.amountOwed}.`);
  logger.info(JSON.stringify(utilityBill));
  await page.screenshot({ path: 'dist/payment-amount.png' });

  logger.info('Closing browser.');
  await browser.close();
  return 0;
}

main()
  .then((code: number) => {
    logger.info('Process completed successfully.');
    process.exit(code);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
