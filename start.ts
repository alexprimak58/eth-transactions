import { binanceConfig, generalConfig } from './config';
import { Binance } from './modules/binance';
import { Mintfun } from './modules/mintfun';
import { random, randomFloat, shuffle, sleep } from './utils/common';
import { makeLogger } from './utils/logger';
import { entryPoint } from './utils/menu';
import { privateKeyConvert, readWallets } from './utils/wallet';

let privateKeys = readWallets('./keys.tsx');

if (generalConfig.shuffleWallets) {
  shuffle(privateKeys);
}

async function binanceModule() {
  const logger = makeLogger('Binance');
  for (let privateKey of privateKeys) {
    const sum = randomFloat(
      binanceConfig.withdrawFrom,
      binanceConfig.withdrawTo
    );
    const binance = new Binance(privateKeyConvert(privateKey));
    await binance.withdraw(sum.toString());

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function mintfunModule() {
  const logger = makeLogger('Mintfun');
  for (let privateKey of privateKeys) {
    const mintfun = new Mintfun(privateKeyConvert(privateKey));

    await mintfun.mint();
    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function startMenu() {
  let mode = await entryPoint();
  switch (mode) {
    case 'binance':
      await binanceModule();
      break;
    case 'mintfun':
      await mintfunModule();
      break;
  }
}

await startMenu();
