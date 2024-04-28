export const generalConfig = {
  ethrpc: 'https://rpc.ankr.com/eth',
  baserpc: 'https://rpc.ankr.com/base',
  sleepFrom: 60,
  sleepTo: 150,
  shuffleWallets: false,
  shuffleCustomModules: true,
  maxGas: 15,
  maxAddressTxCount: 100,
  countModulesFrom: 1,
  countModulesTo: 3,
  customModules: ['l2telegraph', 'mintfun', 'uniswap'],
};

export const bridgeConfig = {
  type: 'official',
  stargateFrom: 'arbitrum', // 'arbitrum', 'optimism', 'random'
  bridgeFrom: 0.001,
  bridgeTo: 0.002,
  stargateBridgeFrom: 0.003,
  stargateBridgeTo: 0.004,
  maxGas: 10, // for official bridge Eth -> Base
};

export const binanceConfig = {
  key: '',
  secret: '',
  proxy: '',
  destNetwork: 'random', //or set 1 network
  networks: ['Arb', 'Base', 'Op', 'zkSyncEra'],
  coin: 'ETH', //in upper case
  withdrawFrom: 0.001, // min: 0.001
  withdrawTo: 0.0013,
  useRefill: false,
};

export const okxConfig = {
  key: '',
  secret: '',
  passphrase: '',
  proxy: '',
  destNetwork: 'random', //or set 1 network
  networks: ['Arb', 'Base', 'Op', 'zkSyncEra'],
  coin: 'ETH', //in upper case
  withdrawFrom: 0.001, // min: 0.001
  withdrawTo: 0.0013,
  useRefill: false,
};

export const bungeeConfig = {
  refuelFrom: 0.00005,
  refuelTo: 0.00016,
  destinationNetwork: 'random', //arbitrum, base, gnosis, optimism, zksync
};

export const blurConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const zkSyncLiteConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const wrapConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const baseBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
};

export const zoraBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
};

export const scrollBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
};
