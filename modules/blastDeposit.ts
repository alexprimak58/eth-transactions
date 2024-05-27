import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import { sleep } from '../utils/common';

export class BlastDeposit {
  privateKey: Hex;
  depositContractAddress: Hex = '0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb';
  logger: any;
  wallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Blast deposit');
    this.wallet = getEthWalletClient(privateKey);
  }

  async deposit(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(
      `${this.wallet.account.address} | Blast deposit ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.sendTransaction({
          to: this.depositContractAddress,
          value: value,
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success blast deposit: https://etherscan.io/tx/${txHash}`
        );
      } catch (error) {
        this.logger.info(
          `${this.wallet.account.address} | Error ${error.shortMessage}`
        );

        if (retryCount <= 3) {
          this.logger.info(
            `${this.wallet.account.address} | Wait 30 sec and retry deposit ${retryCount}/3`
          );
          retryCount++;
          await sleep(30 * 1000);
        } else {
          isSuccess = true;
          this.logger.info(
            `${this.wallet.account.address} | Blast deposit unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | Blast deposit error: ${error.shortMessage}`
        );
      }
    }
  }
}
