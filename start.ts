import {
  baseBridgeConfig,
  binanceConfig,
  blurConfig,
  bungeeConfig,
  generalConfig,
  okxConfig,
  relayBridgeConfig,
  scrollBridgeConfig,
  wrapConfig,
  zkSyncLiteConfig,
  zoraBridgeConfig,
} from './config';
import { BaseBridge } from './modules/baseBridge';
import { Binance } from './modules/binance';
import { WrapEth } from './modules/wrapEth';
import { Bungee } from './modules/bungee';
import { Mintfun } from './modules/mintfun';
import { ZoraBridge } from './modules/zoraBridge';
import { random, randomFloat, shuffle, sleep } from './utils/common';
import { waitGas } from './utils/getCurrentGas';
import { makeLogger } from './utils/logger';
import { entryPoint } from './utils/menu';
import { privateKeyConvert, readWallets } from './utils/wallet';
import { BlurDeposit } from './modules/blurDeposit';
import { ZkSyncLiteDeposit } from './modules/zkSyncLiteDeposit';
import { ScrollBridge } from './modules/scrollBridge';
import { OKX } from './modules/okx';
import { RelayBridge } from './modules/relayBridge';

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

async function okxModule() {
  const logger = makeLogger('OKX');
  for (let privateKey of privateKeys) {
    const sum = randomFloat(okxConfig.withdrawFrom, okxConfig.withdrawTo);
    const okx = new OKX(privateKeyConvert(privateKey));

    await okx.withdraw(sum.toString());

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

async function blurDepositModule() {
  const logger = makeLogger('Blur deposit');
  for (let privateKey of privateKeys) {
    const deposit = new BlurDeposit(privateKeyConvert(privateKey));
    const sum = randomFloat(blurConfig.depositFrom, blurConfig.depositTo);

    if (await waitGas()) {
      await deposit.deposit(sum.toString());
    }

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function zkSyncLiteDepositModule() {
  const logger = makeLogger('ZkSync Lite deposit');
  for (let privateKey of privateKeys) {
    const deposit = new ZkSyncLiteDeposit(privateKeyConvert(privateKey));
    const sum = randomFloat(
      zkSyncLiteConfig.depositFrom,
      zkSyncLiteConfig.depositTo
    );

    if (await waitGas()) {
      await deposit.deposit(sum.toString());
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

async function scrollBridgeModule() {
  const logger = makeLogger('Scroll bridge');
  for (let privateKey of privateKeys) {
    const bridge = new ScrollBridge(privateKeyConvert(privateKey));
    const sum = randomFloat(
      scrollBridgeConfig.bridgeFrom,
      scrollBridgeConfig.bridgeTo
    );

    if (await waitGas()) {
      await bridge.bridge(sum.toString());
    }

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function relayBridgeFromEthModule() {
  const logger = makeLogger('Relay bridge');
  for (let privateKey of privateKeys) {
    const bridge = new RelayBridge(privateKeyConvert(privateKey));
    const sum = randomFloat(
      relayBridgeConfig.bridgeFrom,
      relayBridgeConfig.bridgeTo
    );

    if (await waitGas()) {
      await bridge.bridgeFromEth(sum.toString());
    }

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function relayBridgeToEthModule() {
  const logger = makeLogger('Relay bridge');
  for (let privateKey of privateKeys) {
    const bridge = new RelayBridge(privateKeyConvert(privateKey));
    const sum = randomFloat(
      relayBridgeConfig.bridgeFrom,
      relayBridgeConfig.bridgeTo
    );

    if (await waitGas()) {
      await bridge.bridgeToEth(sum.toString());
    }

    const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
    logger.info(`Waiting ${sleepTime} sec until next wallet...`);
    await sleep(sleepTime * 1000);
  }
}

async function customModule() {
  const logger = makeLogger('Custom');
  let customModules = generalConfig.customModules;

  for (let privateKey of privateKeys) {
    if (generalConfig.useOkx) {
      const okx = new OKX(privateKeyConvert(privateKey));

      const withdrawSum = randomFloat(
        okxConfig.withdrawFrom,
        okxConfig.withdrawTo
      );

      await okx.withdraw(withdrawSum.toString());
    }

    if (await waitGas()) {
      let sleepTime;
      let customModulesCount = random(
        generalConfig.countModulesFrom,
        generalConfig.countModulesTo
      );
      let shuffledModules = generalConfig.shuffleCustomModules
        ? shuffle(customModules)
        : customModules;
      let userCustomModules = shuffledModules.slice(0, customModulesCount);

      for (let customModuleItem of userCustomModules) {
        if (generalConfig.useBridge) {
          switch (customModuleItem) {
            case 'mintfun':
              const mintfun = new Mintfun(privateKeyConvert(privateKey));
              await mintfun.mint();
              break;
            case 'relay_bridge_from_eth':
              const relaySumFromEth = random(
                relayBridgeConfig.bridgeFrom,
                relayBridgeConfig.bridgeTo
              );
              const relayBridgeFromEth = new RelayBridge(
                privateKeyConvert(privateKey)
              );
              await relayBridgeFromEth.bridgeFromEth(
                relaySumFromEth.toString()
              );
              break;
            case 'relay_bridge_to_eth':
              const relaySumToEth = random(
                relayBridgeConfig.bridgeFrom,
                relayBridgeConfig.bridgeTo
              );
              const relayBridgeToEth = new RelayBridge(
                privateKeyConvert(privateKey)
              );
              await relayBridgeToEth.bridgeToEth(relaySumToEth.toString());
              break;
            case 'scroll_bridge':
              const scrollSum = random(
                scrollBridgeConfig.bridgeFrom,
                scrollBridgeConfig.bridgeTo
              );
              const scrollBridge = new ScrollBridge(
                privateKeyConvert(privateKey)
              );
              await scrollBridge.bridge(scrollSum.toString());
              break;
            case 'zora_bridge':
              const zoraSum = random(
                zoraBridgeConfig.bridgeFrom,
                zoraBridgeConfig.bridgeTo
              );
              const zoraBridge = new ZoraBridge(privateKeyConvert(privateKey));
              await zoraBridge.bridge(zoraSum.toString());
              break;
            case 'base_bridge':
              const baseSum = random(
                baseBridgeConfig.bridgeFrom,
                baseBridgeConfig.bridgeTo
              );
              const baseBridge = new BaseBridge(privateKeyConvert(privateKey));
              await baseBridge.bridge(baseSum.toString());
              break;
            case 'wrap_eth':
              const wrapSum = random(
                wrapConfig.depositFrom,
                wrapConfig.depositTo
              );
              const wrapEth = new WrapEth(privateKeyConvert(privateKey));
              await wrapEth.wrap(wrapSum.toString());
              break;
            case 'bungee':
              const bungeeSum = random(
                bungeeConfig.refuelFrom,
                bungeeConfig.refuelTo
              );
              const bungee = new Bungee(privateKeyConvert(privateKey));
              await bungee.refuel(bungeeSum.toString());
              break;
            case 'zksync_lite_deposit':
              const zkSum = random(
                zkSyncLiteConfig.depositFrom,
                zkSyncLiteConfig.depositTo
              );
              const zkSyncLiteDeposit = new ZkSyncLiteDeposit(
                privateKeyConvert(privateKey)
              );
              await zkSyncLiteDeposit.deposit(zkSum.toString());
              break;
            case 'blur_deposit':
              const blurSum = random(
                blurConfig.depositFrom,
                blurConfig.depositTo
              );
              const blurDeposit = new BlurDeposit(
                privateKeyConvert(privateKey)
              );
              await blurDeposit.deposit(blurSum.toString());
              break;
          }
        } else {
          switch (customModuleItem) {
            case 'mintfun':
              const mintfun = new Mintfun(privateKeyConvert(privateKey));
              await mintfun.mint();
              break;
            case 'wrap_eth':
              const wrapSum = random(
                wrapConfig.depositFrom,
                wrapConfig.depositTo
              );
              const wrapEth = new WrapEth(privateKeyConvert(privateKey));
              await wrapEth.wrap(wrapSum.toString());
              break;
            case 'bungee':
              const bungeeSum = random(
                bungeeConfig.refuelFrom,
                bungeeConfig.refuelTo
              );
              const bungee = new Bungee(privateKeyConvert(privateKey));
              await bungee.refuel(bungeeSum.toString());
              break;
            case 'zksync_lite_deposit':
              const zkSum = random(
                zkSyncLiteConfig.depositFrom,
                zkSyncLiteConfig.depositTo
              );
              const zkSyncLiteDeposit = new ZkSyncLiteDeposit(
                privateKeyConvert(privateKey)
              );
              await zkSyncLiteDeposit.deposit(zkSum.toString());
              break;
            case 'blur_deposit':
              const blurSum = random(
                blurConfig.depositFrom,
                blurConfig.depositTo
              );
              const blurDeposit = new BlurDeposit(
                privateKeyConvert(privateKey)
              );
              await blurDeposit.deposit(blurSum.toString());
              break;
          }
        }

        sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo);
        logger.info(`Waiting ${sleepTime} sec until next module...`);
        await sleep(sleepTime * 1000);
      }

      sleepTime = random(
        generalConfig.sleepWalletsFrom,
        generalConfig.sleepWalletsTo
      );
      logger.info(`Waiting ${sleepTime} sec until next wallet...`);
      await sleep(sleepTime * 1000);
    }
  }
}

async function startMenu() {
  let mode = await entryPoint();
  switch (mode) {
    case 'binance':
      await binanceModule();
      break;
    case 'okx':
      await okxModule();
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
    case 'blur_deposit':
      await blurDepositModule();
      break;
    case 'zksync_lite_deposit':
      await zkSyncLiteDepositModule();
      break;
    case 'base_bridge':
      await baseBridgeModule();
      break;
    case 'zora_bridge':
      await zoraBridgeModule();
      break;
    case 'scroll_bridge':
      await scrollBridgeModule();
      break;
    case 'relay_bridge_from_eth':
      await relayBridgeFromEthModule();
      break;
    case 'relay_bridge_to_eth':
      await relayBridgeToEthModule();
      break;
    case 'custom':
      await customModule();
      break;
  }
}

await startMenu();
