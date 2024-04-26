import { Hex } from 'viem';
import { getPublicEthClient } from './clients/ethClient';

export async function getAddressTxCount(address: Hex) {
  const client = getPublicEthClient();
  return await client.getTransactionCount({
    address: address,
  });
}
