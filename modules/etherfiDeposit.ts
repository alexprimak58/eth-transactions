import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import { sleep } from '../utils/common';
import { etherfiDepositAbi } from '../data/abi/etherfiDeposit';

export class EtherfiDeposit {
  privateKey: Hex;
  depositContractAddress: Hex = '0x308861A430be4cce5502d0A12724771Fc6DaF216';
  depositRefferalLink: Hex = '0x2CC0B05E01D3E5a8946C2E6246550E6694fc8797';
  logger: any;
  wallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Etherfi deposit');
    this.wallet = getEthWalletClient(privateKey);
  }

  async deposit(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(
      `${this.wallet.account.address} | Etherfi deposit ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.depositContractAddress,
          abi: etherfiDepositAbi,
          functionName: 'deposit',
          args: [this.depositRefferalLink],
          value: value,
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success etherfi deposit: https://etherscan.io/tx/${txHash}`
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
            `${this.wallet.account.address} | Etherfi deposit unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | Etherfi deposit error: ${error.shortMessage}`
        );
      }
    }
  }
}
