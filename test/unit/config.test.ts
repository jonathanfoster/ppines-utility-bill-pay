import config from '../../src/config';

describe('config', () => {
  it('env should be equal to PPINES_ENV', () => {
    expect(config.ppines.env).toEqual(process.env.PPINES_ENV);
  });

  it('env should be equal to LOG_LEVEL', () => {
    expect(config.ppines.logLevel).toEqual(process.env.LOG_LEVEL);
  });
});
