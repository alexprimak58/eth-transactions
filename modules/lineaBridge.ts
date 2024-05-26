import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import { sleep } from '../utils/common';
import { lineaBridgeAbi } from '../data/abi/lineaBridge';

export class LineaBridge {
  privateKey: Hex;
  bridgeContractAddress: Hex = '0xd19d4B5d358258f05D7B411E21A1460D11B0876F';
  logger: any;
  wallet: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Linea bridge');
    this.wallet = getEthWalletClient(privateKey);
  }

  async bridge(amount: string) {
    const value: bigint = BigInt(parseEther(amount));

    this.logger.info(
      `${this.wallet.account.address} | Linea bridge ${amount} ETH`
    );

    const args: readonly [`0x${string}`, bigint, string] = [
      this.wallet.account.address,
      parseEther(amount),
      '0x',
    ];

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.bridgeContractAddress,
          abi: lineaBridgeAbi,
          functionName: 'sendMessage',
          args: args,
          value: value,
        });

        isSuccess = true;
        this.logger.info(
          `${this.wallet.account.address} | Success bridge on Linea: https://etherscan.io/tx/${txHash}`
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
            `${this.wallet.account.address} | Linea bridge unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | Linea bridge error: ${error.shortMessage}`
        );
      }
    }
  }
}
