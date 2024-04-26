import {
  baseBridgeConfig,
  binanceConfig,
  bungeeConfig,
  generalConfig,
  wrapConfig,
  zoraBridgeConfig,
} from './config';
import { BaseBridge } from './modules/baseBridge';
import { Binance } from './modules/binance';
import { WrapEth } from './modules/wrapEth';
import { Bungee } from './modules/bungee';
import { Mintfun } from './modules/mintfun';
import { ZoraBridge } from './modules/zoraBridge';
import { getEthWalletClient } from './utils/clients/ethClient';
import { random, randomFloat, shuffle, sleep } from './utils/common';
import { getAddressTxCount } from './utils/getAddressTxCount';
import { waitGas } from './utils/getCurrentGas';
import { makeLogger } from './utils/logger';
import { entryPoint } from './utils/menu';
import { privateKeyConvert, readWallets } from './utils/wallet';

let privateKeys = readWallets('./keys.txt');

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

    if (await waitGas()) {
      await mintfun.mint();
    }

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function bungeeModule() {
  const logger = makeLogger('Bungee');
  for (let privateKey of privateKeys) {
    const merkly = new Bungee(privateKeyConvert(privateKey));
    const sum = randomFloat(bungeeConfig.refuelFrom, bungeeConfig.refuelTo);

    if (await waitGas()) {
      await merkly.refuel(sum.toString());
    }

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function wrapEthModule() {
  const logger = makeLogger('Wrap eth');
  for (let privateKey of privateKeys) {
    const wrap = new WrapEth(privateKeyConvert(privateKey));
    const sum = randomFloat(wrapConfig.depositFrom, wrapConfig.depositTo);

    if (await waitGas()) {
      await wrap.wrap(sum.toString());
    }
    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function baseBridgeModule() {
  const logger = makeLogger('Base bridge');
  for (let privateKey of privateKeys) {
    const bridge = new BaseBridge(privateKeyConvert(privateKey));
    const sum = randomFloat(
      baseBridgeConfig.bridgeFrom,
      baseBridgeConfig.bridgeTo
    );

    if (await waitGas()) {
      await bridge.bridge(sum.toString());
    }

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function zoraBridgeModule() {
  const logger = makeLogger('Zora bridge');
  for (let privateKey of privateKeys) {
    const bridge = new ZoraBridge(privateKeyConvert(privateKey));
    const sum = randomFloat(
      zoraBridgeConfig.bridgeFrom,
      zoraBridgeConfig.bridgeTo
    );

    if (await waitGas()) {
      await bridge.bridge(sum.toString());
    }

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
    case 'bungee':
      await bungeeModule();
      break;
    case 'wrap_eth':
      await wrapEthModule();
      break;
    case 'base_bridge':
      await baseBridgeModule();
      break;
    case 'zora_bridge':
      await zoraBridgeModule();
      break;
  }
}

await startMenu();
