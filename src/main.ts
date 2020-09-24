import config from './config';
import logger from './logger';
import BillPayProcess from './utility/bill-pay-process';

async function main(): Promise<number> {
  if (!config.accountNo) {
    logger.error('Account number not provided.');
    return 1;
  }

  if (!config.houseNo) {
    logger.error('House number not provided.');
    return 1;
  }

  const billPayProcess = new BillPayProcess(config.accountNo, config.houseNo, config.url);

  logger.info(`Starting ${billPayProcess.processName} process.`);
  const returnCode = await billPayProcess.run();

  if (returnCode === 0) {
    logger.info(`${billPayProcess.processName} process completed successfully.`);
  } else {
    logger.warn(`${billPayProcess.processName} process completed with errors.`);
  }

  return returnCode;
}

main()
  .then((returnCode: number) => {
    process.exit(returnCode);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
