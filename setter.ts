import { Hex } from 'viem';
import { randomFloat } from './utils/common';
import {
  baseBridgeConfig,
  blastConfig,
  blurConfig,
  bungeeConfig,
  etherfiConfig,
  lineaBridgeConfig,
  relayBridgeConfig,
  scrollBridgeConfig,
  swellConfig,
  wrapConfig,
  zkSyncBridgeConfig,
  zkSyncLiteConfig,
  zoraBridgeConfig,
} from './config';
import { BaseBridge } from './modules/baseBridge';
import { BlastDeposit } from './modules/blastDeposit';
import { BlurDeposit } from './modules/blurDeposit';
import { Bungee } from './modules/bungee';
import { EtherfiDeposit } from './modules/etherfiDeposit';
import { LineaBridge } from './modules/lineaBridge';
import { RelayBridge } from './modules/relayBridge';
import { MintScalingLens } from './modules/scalingLensMint';
import { ScrollBridge } from './modules/scrollBridge';
import { SwellDeposit } from './modules/swellDeposit';
import { WrapEth } from './modules/wrapEth';
import { MintZerionDna } from './modules/zerionDnaMint';
import { ZkSyncBridge } from './modules/zkSyncBridge';
import { ZkSyncLiteDeposit } from './modules/zkSyncLiteDeposit';
import { ZoraBridge } from './modules/zoraBridge';
import { privateKeyConvert } from './utils/wallet';

export const moduleActions: {
  [key: string]: (privateKey: Hex) => Promise<void>;
} = {
  blast_deposit: async (privateKey: Hex) => {
    const blastSum = randomFloat(
      blastConfig.depositFrom,
      blastConfig.depositTo
    );
    const blast = new BlastDeposit(privateKeyConvert(privateKey));
    await blast.deposit(blastSum.toString());
  },
  blur_deposit: async (privateKey: Hex) => {
    const blurSum = randomFloat(blurConfig.depositFrom, blurConfig.depositTo);
    const blur = new BlurDeposit(privateKeyConvert(privateKey));
    await blur.deposit(blurSum.toString());
  },
  etherfi_deposit: async (privateKey: Hex) => {
    const etherfiSum = randomFloat(
      etherfiConfig.depositFrom,
      etherfiConfig.depositTo
    );
    const etherfi = new EtherfiDeposit(privateKeyConvert(privateKey));
    await etherfi.deposit(etherfiSum.toString());
  },
  swell_deposit: async (privateKey: Hex) => {
    const swellSum = randomFloat(
      swellConfig.depositFrom,
      swellConfig.depositTo
    );
    const swell = new SwellDeposit(privateKeyConvert(privateKey));
    await swell.deposit(swellSum.toString());
  },
  zksync_lite_deposit: async (privateKey: Hex) => {
    const zkSyncLiteSum = randomFloat(
      zkSyncLiteConfig.depositFrom,
      zkSyncLiteConfig.depositTo
    );
    const zkSyncLite = new ZkSyncLiteDeposit(privateKeyConvert(privateKey));
    await zkSyncLite.deposit(zkSyncLiteSum.toString());
  },
  wrap_eth: async (privateKey: Hex) => {
    const wrapSum = randomFloat(wrapConfig.depositFrom, wrapConfig.depositTo);
    const wrapEth = new WrapEth(privateKeyConvert(privateKey));
    await wrapEth.wrap(wrapSum.toString());
  },
  base_bridge: async (privateKey: Hex) => {
    const baseSum = randomFloat(
      baseBridgeConfig.bridgeFrom,
      baseBridgeConfig.bridgeTo
    );
    const base = new BaseBridge(privateKeyConvert(privateKey));
    await base.bridge(baseSum.toString());
  },
  bungee: async (privateKey: Hex) => {
    const bungeeSum = randomFloat(
      bungeeConfig.refuelFrom,
      bungeeConfig.refuelTo
    );
    const bungee = new Bungee(privateKeyConvert(privateKey));
    await bungee.refuel(bungeeSum.toString());
  },
  linea_bridge: async (privateKey: Hex) => {
    const lineaSum = randomFloat(
      lineaBridgeConfig.bridgeFrom,
      lineaBridgeConfig.bridgeTo
    );
    const linea = new LineaBridge(privateKeyConvert(privateKey));
    await linea.bridge(lineaSum.toString());
  },
  relay_bridge_from_eth: async (privateKey: Hex) => {
    const relaySum = randomFloat(
      relayBridgeConfig.bridgeFrom,
      relayBridgeConfig.bridgeTo
    );
    const relay = new RelayBridge(privateKeyConvert(privateKey));
    await relay.bridgeFromEth(relaySum.toString());
  },
  scroll_bridge: async (privateKey: Hex) => {
    const scrollSum = randomFloat(
      scrollBridgeConfig.bridgeFrom,
      scrollBridgeConfig.bridgeTo
    );
    const scroll = new ScrollBridge(privateKeyConvert(privateKey));
    await scroll.bridge(scrollSum.toString());
  },
  zksync_bridge: async (privateKey: Hex) => {
    const zkSyncSum = randomFloat(
      zkSyncBridgeConfig.bridgeFrom,
      zkSyncBridgeConfig.bridgeTo
    );
    const zkSync = new ZkSyncBridge(privateKeyConvert(privateKey));
    await zkSync.bridge(zkSyncSum.toString());
  },
  zora_bridge: async (privateKey: Hex) => {
    const zoraSum = randomFloat(
      zoraBridgeConfig.bridgeFrom,
      zoraBridgeConfig.bridgeTo
    );
    const zora = new ZoraBridge(privateKeyConvert(privateKey));
    await zora.bridge(zoraSum.toString());
  },
  mint_zerion_dna: async (privateKey: Hex) => {
    const zerionDna = new MintZerionDna(privateKeyConvert(privateKey));
    await zerionDna.mint();
  },
  mint_scaling_lens: async (privateKey: Hex) => {
    const scalingLens = new MintScalingLens(privateKeyConvert(privateKey));
    await scalingLens.mint();
  },
};

export const bridgeModules = new Set([
  'base_bridge',
  'linea_bridge',
  'scroll_bridge',
  'zora_bridge',
  'zksync_bridge',
  'relay_bridge_from_eth',
  'relay_bridge_to_eth',
]);

export const depositModules = new Set([
  'blast_deposit',
  'blur_deposit',
  'etherfi_deposit',
  'swell_deposit',
  'wrap_eth',
  'zksync_lite_deposit',
]);

export const mintModules = new Set(['mint_zerion_dna', 'mint_scaling_lens']);
