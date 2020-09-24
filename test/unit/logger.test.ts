import config from '../../src/config';
import logger from '../../src/logger';

describe('logger', () => {
  it('level should be equal to LOG_LEVEL', () => {
    expect(logger.level).toEqual(config.ppines.logLevel);
  });
});
