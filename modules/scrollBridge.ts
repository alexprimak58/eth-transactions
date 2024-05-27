import { Hex, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import {
  getEthWalletClient,
  getPublicEthClient,
} from '../utils/clients/ethereum';
import { scrollBridgeAbi } from '../data/abi/scrollBridge';
import { sleep } from '../utils/common';
import { scrollFeeAbi } from '../data/abi/scrollFee';

export class ScrollBridge {
  privateKey: Hex;
  bridgeContractAddress: Hex = '0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367';
  feeContractAddress: Hex = '0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B';
  logger: any;
  wallet: any;
  client: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Scroll bridge');
    this.wallet = getEthWalletClient(privateKey);
    this.client = getPublicEthClient();
  }

  async getBridgeCost(gasLimit: number) {
    const amountForTx = await this.client.readContract({
      address: this.feeContractAddress,
      abi: scrollFeeAbi,
      function: 'estimateCrossDomainMessageFee',
      args: [gasLimit],
    });
    return amountForTx;
  }

  async bridge(amount: string) {
    let value: bigint = BigInt(parseEther(amount));
    const bridgeCost = await this.getBridgeCost(168000);

    value = value + bridgeCost;

    this.logger.info(
      `${this.wallet.account.address} | Scroll bridge ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.wallet.writeContract({
          address: this.bridgeContractAddress,
          abi: scrollBridgeAbi,
          functionName: 'sendMessage',
          args: [this.wallet.account.address, parseEther(amount), '0x', 168000],
          value: value,
        });

        isSuccess = true;

        this.logger.info(
          `${this.wallet.account.address} | Success bridge on Scroll: https://etherscan.io/tx/${txHash}`
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
            `${this.wallet.account.address} | Bridge unsuccessful, skip`
          );
        }

        this.logger.error(
          `${this.wallet.account.address} | Scroll bridge error: ${error.shortMessage}`
        );
      }
    }
  }
}
