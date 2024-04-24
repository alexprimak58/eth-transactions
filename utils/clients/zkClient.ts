import {
  Chain,
  Hex,
  HttpTransport,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const zkSync = defineChain({
  id: 324,
  name: 'zkSync Era',
  network: 'zksync-era',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.era.zksync.io'],
      webSocket: ['wss://mainnet.era.zksync.io/ws'],
    },
    public: {
      http: ['https://mainnet.era.zksync.io'],
      webSocket: ['wss://mainnet.era.zksync.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'zkExplorer',
      url: 'https://explorer.zksync.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    },
  },
});

function getPublicZkClient(): PublicClient {
  return createPublicClient({ chain: zkSync, transport: http() });
}

function getZkWalletClient(
  privateKey: Hex
): WalletClient<HttpTransport, Chain, PrivateKeyAccount> {
  return createWalletClient({
    chain: zkSync,
    account: privateKeyToAccount(privateKey),
    transport: http(),
  });
}

export { getPublicZkClient, getZkWalletClient };
