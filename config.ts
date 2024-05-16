export const generalConfig = {
  ethrpc: 'https://rpc.ankr.com/eth',
  baserpc: 'https://rpc.ankr.com/base',
  sleepFrom: 1,
  sleepTo: 3,
  sleepWalletsFrom: 3,
  sleepWalletsTo: 5,
  shuffleWallets: false,
  shuffleCustomModules: true,
  maxGas: 15,
  maxAddressTxCount: 100,
  countModulesFrom: 3,
  countModulesTo: 5,
  customModules: [
    'mintfun',
    'base_bridge',
    'zora_bridge',
    'scroll_bridge',
    'wrap_eth',
  ],
  useOkx: true,
  useBridge: true,
};

export const binanceConfig = {
  key: '',
  secret: '',
  proxy: '',
  destNetwork: 'random', //or set 1 network
  destNetworks: ['Arb', 'Base', 'Op', 'zkSyncEra'],
  coin: 'ETH',
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
  destNetworks: ['Arbitrum One', 'Base', 'Optimism', 'zkSync Era'],
  coin: 'ETH',
  withdrawFrom: 0.001, // min: 0.001, for Base - 0.002
  withdrawTo: 0.0013,
  useRefill: false,
};

export const bungeeConfig = {
  refuelFrom: 0.00005,
  refuelTo: 0.00016,
  destNetwork: 'random', //arbitrum, base, gnosis, optimism, zksync
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

export const bridgeConfig = {
  type: 'official',
  stargateFrom: 'arbitrum', // 'arbitrum', 'optimism', 'random'
  bridgeFrom: 0.001,
  bridgeTo: 0.002,
  stargateBridgeFrom: 0.003,
  stargateBridgeTo: 0.004,
  maxGas: 10, // for official bridge Eth -> Base
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

export const relayBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
  //bridge to ETH
  fromNetwork: 'random', //or set 1 network
  fromNetworks: [
    {
      name: 'Arb',
      id: 42161,
    },
    {
      name: 'Base',
      id: 8453,
    },
    {
      name: 'Op',
      id: 10,
    },
    {
      name: 'zkSyncEra',
      id: 324,
    },
  ],
  //bridge from ETH
  destNetwork: 'random', //or set 1 network
  destNetworks: [
    {
      name: 'Arb',
      id: 42161,
    },
    {
      name: 'Base',
      id: 8453,
    },
    {
      name: 'Op',
      id: 10,
    },
    {
      name: 'zkSyncEra',
      id: 324,
    },
  ],
};
