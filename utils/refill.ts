import { Hex } from 'viem';
import { makeLogger } from './logger';
import { random, randomFloat } from './common';
import { binanceConfig, generalConfig } from '../config';
import { Binance } from '../modules/binance';
import { privateKeyConvert } from './wallet';

export async function refill(privateKey: Hex) {
  const logger = makeLogger('Binance');
  const sum = randomFloat(
    generalConfig.topupValueFrom,
    generalConfig.topupValueTo
  );
  const binance = new Binance(privateKeyConvert(privateKey));
  await binance.withdraw(sum.toString());

  const sleepTime = random(
    generalConfig.sleepModulesFrom,
    generalConfig.sleepModulesTo
  );
  logger.info(`Waiting ${sleepTime} sec after refill...`);
}
