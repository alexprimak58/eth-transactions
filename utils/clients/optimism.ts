import { publicL2OpStackActions } from 'op-viem';
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

export const optimism = defineChain({
  id: 10,
  name: 'Optimism',
  network: 'optimism',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://optimism.llamarpc.com'],
      webSocket: ['wss://https://optimism.llamarpc.com'],
    },
    public: {
      http: ['https://optimism.llamarpc.com'],
      webSocket: ['wss://https://optimism.llamarpc.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://optimistic.etherscan.io/' },
  },
});

function getPublicOptClient(): PublicClient {
  return createPublicClient({ chain: optimism, transport: http() }).extend(
    publicL2OpStackActions
  );
}

function getOptWalletClient(
  privateKey: Hex
): WalletClient<HttpTransport, Chain, PrivateKeyAccount> {
  return createWalletClient({
    chain: optimism,
    account: privateKeyToAccount(privateKey),
    transport: http(),
  });
}

export { getPublicOptClient, getOptWalletClient };
