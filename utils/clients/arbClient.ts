import {
  Chain,
  Hex,
  HttpTransport,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum } from 'viem/chains';

function getPublicArbClient(): PublicClient {
  return createPublicClient({ chain: arbitrum, transport: http() });
}

function getArbWalletClient(
  privateKey: Hex
): WalletClient<HttpTransport, Chain, PrivateKeyAccount> {
  return createWalletClient({
    chain: arbitrum,
    account: privateKeyToAccount(privateKey),
    transport: http(),
  });
}

export { getPublicArbClient, getArbWalletClient };
