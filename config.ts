export const generalConfig = {
  ethrpc: 'https://rpc.ankr.com/eth',
  baserpc: 'https://rpc.ankr.com/base',
  sleepWithdrawFrom: 1,
  sleepWithdrawTo: 5,
  sleepModulesFrom: 1,
  sleepModulesTo: 5,
  sleepWalletsFrom: 1,
  sleepWalletsTo: 5,
  shuffleWallets: false,
  shuffleCustomModules: true,
  maxGas: 15,
  countModulesFrom: 1,
  countModulesTo: 5,
  customModules: [
    //bridges
    { name: 'base_bridge', weight: 1 },
    { name: 'bungee', weight: 1 },
    { name: 'linea_bridge', weight: 1 },
    { name: 'relay_bridge_from_eth', weight: 1 },
    { name: 'scroll_bridge', weight: 1 },
    { name: 'zksync_bridge', weight: 1 },
    { name: 'zora_bridge', weight: 1 },
    //deposits
    { name: 'blast_deposit', weight: 1 },
    { name: 'blur_deposit', weight: 1 },
    { name: 'etherfi_deposit', weight: 1 },
    { name: 'swell_deposit', weight: 1 },
    { name: 'wrap_eth', weight: 1 },
    { name: 'zksync_lite_deposit', weight: 1 },
    //mints
    { name: 'mint_zerion_dna', weight: 1 },
    { name: 'mint_scaling_lens', weight: 1 },
  ],
  useBridges: true,
  useDeposits: true,
  useMints: true,
  useTopup: false,
  topupValueFrom: 0.001,
  topupValueTo: 0.0013,
};

export const binanceConfig = {
  key: '',
  secret: '',
  proxy: '',
  destNetwork: 'random', //or set 1 network
  destNetworks: ['Arb', 'Base', 'Op', 'zkSyncEra'],
  coin: 'ETH',
  useRefill: false,
};

export const okxConfig = {
  key: '',
  secret: '',
  passphrase: '',
  proxy: '',
  destNetwork: 'random', //or set 1 network
  destNetworks: ['Arbitrum One', 'Base', 'Optimism', 'zkSync Era', 'Linea'],
  coin: 'ETH',
  useRefill: false,
};

export const blastConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const blurConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const bungeeConfig = {
  refuelFrom: 0.00005,
  refuelTo: 0.00016,
  destNetwork: 'random', //arbitrum, base, gnosis, optimism, zksync
};

export const etherfiConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const swellConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const wrapConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const zkSyncLiteConfig = {
  depositFrom: 0.00005,
  depositTo: 0.00016,
};

export const baseBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
};

export const lineaBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
};

export const scrollBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
};

export const zkSyncBridgeConfig = {
  bridgeFrom: 0.00005,
  bridgeTo: 0.00016,
};

export const zoraBridgeConfig = {
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
      name: 'Linea',
      id: 59144,
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
      name: 'Linea',
      id: 59144,
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
