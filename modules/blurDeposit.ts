import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import { sleep } from '../utils/common';
import { blurDepositAbi } from '../data/abi/blurDeposit';

export class BlurDeposit {
  privateKey: Hex;
  depositContractAddress: Hex = '0x0000000000A39bb272e79075ade125fd351887Ac';
  logger: any;
  wallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Blur deposit');
    this.wallet = getEthWalletClient(privateKey);
  }

  async deposit(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(
      `${this.wallet.account.address} | Blur deposit ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.depositContractAddress,
          abi: blurDepositAbi,
          functionName: 'deposit',
          value: value,
          args: [],
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success blur deposit: https://etherscan.io/tx/${txHash}`
        );
      } catch (error) {
        this.logger.info(
          `${this.wallet.account.address} | Error ${error.shortMessage}`
        );

        if (retryCount <= 3) {
          this.logger.info(
            `${this.wallet.account.address} | Wait 30 sec and retry bridge ${retryCount}/3`
          );
          retryCount++;
          await sleep(30 * 1000);
        } else {
          isSuccess = true;
          this.logger.info(
            `${this.wallet.account.address} | Blur deposit unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | Blur deposit error: ${error.shortMessage}`
        );
      }
    }
  }
}
