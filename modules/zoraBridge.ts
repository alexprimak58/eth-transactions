import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import { sleep } from '../utils/common';
import { zoraBridgeAbi } from '../data/abi/zora-bridge';

export class ZoraBridge {
  privateKey: Hex;
  bridgeContractAddress: Hex = '0x1a0ad011913A150f69f6A19DF447A0CfD9551054';
  logger: any;
  wallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Zora bridge');
    this.wallet = getEthWalletClient(privateKey);
  }

  async bridge(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(
      `${this.wallet.account.address} | Zora bridge ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    const args: readonly [`0x${string}`, bigint, bigint, boolean, string] = [
      this.wallet.account.address,
      value,
      BigInt(100000),
      false,
      '',
    ];

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.bridgeContractAddress,
          abi: zoraBridgeAbi,
          functionName: 'depositTransaction',
          args: args,
          value: value,
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success bridge on Zora: https://etherscan.io/tx/${txHash}`
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
            `${this.wallet.account.address} | Bridge unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | Zora bridge error: ${error.shortMessage}`
        );
      }
    }
  }
}
