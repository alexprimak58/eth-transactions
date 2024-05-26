import { Hex, PublicClient } from 'viem';
import { makeLogger } from '../utils/logger';
import {
  getEthWalletClient,
  getPublicEthClient,
} from '../utils/clients/ethereum';
import { binanceConfig } from '../config';
import { sleep } from '../utils/common';
import { submitTx } from '../utils/mintfun';
import { mintfunAbi } from '../data/abi/mintfun';
import { refill } from '../utils/refill';

export class Mintfun {
  privateKey: Hex;
  logger: any;
  client: PublicClient;
  nftContract: Hex = '0x932261f9fc8da46c4a22e31b45c4de60623848bf';

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Mint');
    this.client = getPublicEthClient();
  }

  async mint() {
    const ethWallet = getEthWalletClient(this.privateKey);

    let nftName = '';

    try {
      nftName = await this.client.readContract({
        address: this.nftContract,
        abi: mintfunAbi,
        functionName: 'name',
      });
    } catch (error) {
      this.logger.info(
        `${ethWallet.account.address} | Error: ${error.shortMessage}`
      );
    }

    this.logger.info(`${ethWallet.account.address} | Mint «${nftName}»`);

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await ethWallet.writeContract({
          address: this.nftContract,
          abi: mintfunAbi,
          functionName: 'mint',
        });
        isSuccess = true;
        this.logger.info(
          `${ethWallet.account.address} | Success mint: https://etherscan.io/tx/${txHash}`
        );
        await submitTx(ethWallet.account.address, txHash);
      } catch (error) {
        this.logger.info(
          `${ethWallet.account.address} | Error: ${error.shortMessage}`
        );

        if (retryCount <= 3) {
          if (retryCount === 1) {
            if (
              (error.shortMessage.includes('insufficient funds') ||
                error.shortMessage.includes('exceeds the balance')) &&
              binanceConfig.useRefill
            ) {
              await refill(this.privateKey);
            }
          }

          this.logger.info(
            `${ethWallet.account.address} | Wait 30 sec and retry mint ${retryCount}/3`
          );
          retryCount++;
          await sleep(30 * 1000);
        } else {
          isSuccess = true;
          this.logger.info(
            `${ethWallet.account.address} | Mint unsuccessful, skip`
          );
        }
      }
    }
  }
}
