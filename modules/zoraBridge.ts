import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethClient';
import { sleep } from '../utils/common';
import { zoraBridgeAbi } from '../data/abi/zora-bridge';

export class ZoraBridge {
  privateKey: Hex;
  bridgeContractAddress: Hex = '0x1a0ad011913A150f69f6A19DF447A0CfD9551054';
  logger: any;
  ethWallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Zora bridge');
    this.ethWallet = getEthWalletClient(privateKey);
  }

  async bridge(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(
      `${this.ethWallet.account.address} | Zora bridge ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.ethWallet.writeContract({
          address: this.bridgeContractAddress,
          abi: zoraBridgeAbi,
          functionName: 'depositTransaction',
          args: [
            this.ethWallet.account.address,
            value.toString(),
            BigInt(100000),
            false,
            '0x',
          ],
          value: value,
        });

        isSuccess = true;

        this.logger.info(
          `${this.ethWallet.account.address} | Zora bridge done: https://etherscan.io/tx/${txHash}`
        );
      } catch (error) {
        this.logger.info(`${this.ethWallet.account.address} | Error ${error}`);

        if (retryCount <= 3) {
          this.logger.info(
            `${this.ethWallet.account.address} | Wait 30 sec and retry bridge ${retryCount}/3`
          );
          retryCount++;
          await sleep(30 * 1000);
        } else {
          isSuccess = true;
          this.logger.info(
            `${this.ethWallet.account.address} | Bridge unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.ethWallet.account.address} | Zora bridge error: ${error.shortMessage}`
        );
      }
    }
  }
}
