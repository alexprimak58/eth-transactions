import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import { sleep } from '../utils/common';
import { zkSyncLiteDepositAbi } from '../data/abi/zkSyncLiteDeposit';

export class ZkSyncLiteDeposit {
  privateKey: Hex;
  depositContractAddress: Hex = '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF';
  logger: any;
  wallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('ZkSync Lite deposit');
    this.wallet = getEthWalletClient(privateKey);
  }

  async deposit(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(
      `${this.wallet.account.address} | ZkSync Lite deposit ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.depositContractAddress,
          abi: zkSyncLiteDepositAbi,
          functionName: 'depositETH',
          value: value,
          args: [this.wallet.account.address],
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success ZkSync Lite deposit: https://etherscan.io/tx/${txHash}`
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
            `${this.wallet.account.address} | ZkSync Lite deposit unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | ZkSync Lite deposit error: ${error.shortMessage}`
        );
      }
    }
  }
}
