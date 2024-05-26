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
import { linea } from 'viem/chains';

function getPublicLineaClient(): PublicClient {
  return createPublicClient({ chain: linea, transport: http() });
}

function getLineaWalletClient(
  privateKey: Hex
): WalletClient<HttpTransport, Chain, PrivateKeyAccount> {
  return createWalletClient({
    chain: linea,
    account: privateKeyToAccount(privateKey),
    transport: http(),
  });
}

export { getPublicLineaClient, getLineaWalletClient };
