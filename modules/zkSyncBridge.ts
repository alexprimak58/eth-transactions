import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import {
  getEthWalletClient,
  getPublicEthClient,
} from '../utils/clients/ethereum';
import { random, sleep } from '../utils/common';
import { zkSyncBridgeAbi } from '../data/abi/zkSyncBridge';

export class ZkSyncBridge {
  privateKey: Hex;
  bridgeContractAddress: Hex = '0x32400084C286CF3E17e7B677ea9583e60a000324';
  logger: any;
  wallet: any;
  client: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('ZkSync bridge');
    this.wallet = getEthWalletClient(privateKey);
    this.client = getPublicEthClient();
  }

  async getBridgeCost(gasPrice: bigint, gasLimit: number) {
    const amountForTx = await this.client.readContract({
      address: this.bridgeContractAddress,
      abi: zkSyncBridgeAbi,
      functionName: 'l2TransactionBaseCost',
      args: [gasPrice, gasLimit, 800],
    });
    return amountForTx;
  }

  async bridge(amount: string) {
    let value: bigint = BigInt(parseEther(amount));

    const gasPrice = await this.client.getGasPrice();
    const gasLimit = random(700000, 1000000);
    const bridgeCost = await this.getBridgeCost(gasPrice, gasLimit);

    value = value + bridgeCost;

    this.logger.info(
      `${this.wallet.account.address} | ZkSync bridge ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    const args: readonly [
      `0x${string}`,
      bigint,
      string,
      number,
      number,
      [],
      `0x${string}`
    ] = [
      this.wallet.account.address,
      parseEther(amount),
      '0x',
      gasLimit,
      800,
      [],
      this.wallet.account.address,
    ];

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.bridgeContractAddress,
          abi: zkSyncBridgeAbi,
          functionName: 'requestL2Transaction',
          args: args,
          value: value,
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success bridge on ZkSync: https://etherscan.io/tx/${txHash}`
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
            `${this.wallet.account.address} | ZkSync bridge unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | ZkSync bridge error: ${error.shortMessage}`
        );
      }
    }
  }
}
