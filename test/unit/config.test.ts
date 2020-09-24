import config from '../../src/config';

describe('config', () => {
  it('env should be equal to PPINES_ENV', () => {
    expect(config.env).toEqual(process.env.PPINES_ENV);
  });

  it('logLevel should be equal to LOG_LEVEL', () => {
    expect(config.logLevel).toEqual(process.env.LOG_LEVEL);
  });

  it('url should be equal to PPINES_URL', () => {
    expect(config.url).toEqual(process.env.PPINES_URL);
  });
});
