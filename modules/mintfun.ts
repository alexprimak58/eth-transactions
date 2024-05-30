import { Hex, PublicClient } from 'viem';
import { makeLogger } from '../utils/logger';
import {
  getEthWalletClient,
  getPublicEthClient,
} from '../utils/clients/ethereum';
import { sleep } from '../utils/common';
import { submitTx } from '../utils/mintfun';
import { mintfunAbi } from '../data/abi/mintfun';

export class Mintfun {
  privateKey: Hex;
  logger: any;
  wallet: any;
  client: PublicClient;
  nftContract: Hex = '0x932261f9fc8da46c4a22e31b45c4de60623848bf';

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Mint');
    this.client = getPublicEthClient();
    this.wallet = getEthWalletClient(this.privateKey);
  }

  async mint() {
    let nftName = '';
    let numOfMints;

    try {
      nftName = await this.client.readContract({
        address: this.nftContract,
        abi: mintfunAbi,
        functionName: 'name',
      });
    } catch (error) {
      this.logger.info(
        `${this.wallet.account.address} | Error: ${error.shortMessage}`
      );
    }

    try {
      numOfMints = await this.client.readContract({
        address: this.nftContract,
        abi: mintfunAbi,
        functionName: 'balanceOf',
        args: [this.wallet.account.address],
      });
    } catch (error) {
      this.logger.info(
        `${this.wallet.account.address} | Error: ${error.shortMessage}`
      );
    }

    if (Number(numOfMints) > 0) {
      this.logger.info(
        `${this.wallet.account.address} | «${nftName}» already minted`
      );
    } else {
      this.logger.info(`${this.wallet.account.address} | Mint «${nftName}»`);

      let isSuccess = false;
      let retryCount = 1;

      while (!isSuccess) {
        try {
          const txHash = await this.wallet.writeContract({
            address: this.nftContract,
            abi: mintfunAbi,
            functionName: 'mint',
          });
          isSuccess = true;
          this.logger.info(
            `${this.wallet.account.address} | Success mint: https://etherscan.io/tx/${txHash}`
          );
          await submitTx(this.wallet.account.address, txHash);
        } catch (error) {
          this.logger.info(
            `${this.wallet.account.address} | Error ${error.shortMessage}`
          );

          if (retryCount <= 3) {
            this.logger.info(
              `${this.wallet.account.address} | Wait 30 sec and retry mint ${retryCount}/3`
            );
            retryCount++;
            await sleep(30 * 1000);
          } else {
            isSuccess = true;
            this.logger.info(
              `${this.wallet.account.address} | Mint unsuccessful, skip`
            );
          }

          this.logger.error(
            `${this.wallet.account.address} | Mint error: ${error.shortMessage}`
          );
        }
      }
    }
  }
}
