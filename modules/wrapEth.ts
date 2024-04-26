import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethClient';
import { sleep } from '../utils/common';
import { wrapAbi } from '../data/abi/wrap';

export class WrapEth {
  privateKey: Hex;
  wrapContractAddress: Hex = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  logger: any;
  wallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Wrap eth');
    this.wallet = getEthWalletClient(privateKey);
  }

  async wrap(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(`${this.wallet.account.address} | Wrap ${amount} ETH`);

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.wrapContractAddress,
          abi: wrapAbi,
          functionName: 'deposit',
          value: value,
          args: [],
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success wrap ETH -> WETH: https://etherscan.io/tx/${txHash}`
        );
      } catch (error) {
        this.logger.info(`${this.wallet.account.address} | Error ${error}`);

        if (retryCount <= 3) {
          this.logger.info(
            `${this.wallet.account.address} | Wait 30 sec and retry bridge ${retryCount}/3`
          );
          retryCount++;
          await sleep(30 * 1000);
        } else {
          isSuccess = true;
          this.logger.info(
            `${this.wallet.account.address} | Wrap ETH -> WETH unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | Wrap ETH -> WETH error: ${error.shortMessage}`
        );
      }
    }
  }
}
