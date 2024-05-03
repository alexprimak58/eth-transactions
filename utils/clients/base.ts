import {
  Chain,
  Hex,
  HttpTransport,
  PrivateKeyAccount,
  WalletClient,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

function getPublicBaseClient() {
  return createPublicClient({ chain: base, transport: http() });
}

function getBaseWalletClient(
  privateKey: Hex
): WalletClient<HttpTransport, Chain, PrivateKeyAccount> {
  return createWalletClient({
    chain: base,
    account: privateKeyToAccount(privateKey),
    transport: http(),
  });
}

export { getPublicBaseClient, getBaseWalletClient };
