import { Hex, PublicClient } from 'viem';
import { makeLogger } from '../utils/logger';
import {
  getEthWalletClient,
  getPublicEthClient,
} from '../utils/clients/ethClient';
import { mintfunZerionContract } from '../data/mintfun-contract';
import { binanceConfig } from '../config';
import { sleep } from '../utils/common';
import { submitTx } from '../utils/mintfun';
import { mintfunAbi } from '../data/abi/mintfun';
import { refill } from '../utils/refill';

export class Mintfun {
  privateKey: Hex;
  logger: any;
  client: PublicClient;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Mint');
    this.client = getPublicEthClient();
  }

  async mint() {
    const ethWallet = getEthWalletClient(this.privateKey);

    const contract: Hex = mintfunZerionContract;

    let nftName = '';

    try {
      nftName = await this.client.readContract({
        address: contract,
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
          address: contract,
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
            `${ethWallet.account.address} | mint unsuccessful, skip`
          );
        }
      }
    }
  }
}
