export const generalConfig = {
  ethrpc: 'https://rpc.ankr.com/eth',
  baserpc: 'https://rpc.ankr.com/base',
  sleepFrom: 60,
  sleepTo: 150,
  shuffleWallets: false,
  shuffleCustomModules: true,
  maxGas: 15,
  countModulesFrom: 1,
  countModulesTo: 3,
  customModules: ['l2telegraph', 'mintfun', 'uniswap'],
};

export const binanceConfig = {
  key: '',
  secret: '',
  withdrawFrom: 0.001, // min: 0.001
  withdrawTo: 0.0013,
  useRefill: false,
};
