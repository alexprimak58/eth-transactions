import { Hex, PublicClient, encodeAbiParameters } from 'viem';
import { makeLogger } from '../utils/logger';
import {
  getEthWalletClient,
  getPublicEthClient,
} from '../utils/clients/ethereum';
import { sleep } from '../utils/common';
import { zoraErc1155Abi } from '../data/abi/zoraErc1155';

export class MintScalingLens {
  privateKey: Hex;
  logger: any;
  wallet: any;
  client: PublicClient;
  zoraCreator: Hex = '0x04E2516A2c207E84a1839755675dfd8eF6302F0a';
  zoraLink: Hex = '0x2CC0B05E01D3E5a8946C2E6246550E6694fc8797';
  nftContract: Hex = '0x3d4914b0917fe61379aec014e6ebc2664182cfc6';

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Mint Scaling Lens');
    this.client = getPublicEthClient();
    this.wallet = getEthWalletClient(this.privateKey);
  }

  encodeArguments = (address: any, comment: any) => {
    const encodedParams = encodeAbiParameters(
      [
        { name: 'mintTo', type: 'address' },
        { name: 'comment', type: 'string' },
      ],
      [address, comment]
    );

    return encodedParams;
  };

  async mint() {
    let nftName;
    let numOfMints;
    let mintFee;

    try {
      nftName = await this.client.readContract({
        address: this.nftContract,
        abi: zoraErc1155Abi,
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
        abi: zoraErc1155Abi,
        functionName: 'balanceOf',
        args: [this.wallet.account.address, BigInt(1)],
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
      try {
        mintFee = await this.client.readContract({
          address: this.nftContract,
          abi: zoraErc1155Abi,
          functionName: 'mintFee',
        });
      } catch (error) {
        this.logger.info(
          `${this.wallet.account.address} | Error: ${error.shortMessage}`
        );
      }

      const inputText = '';
      const address = this.wallet.account.address;

      const encodedArguments = this.encodeArguments(address, inputText);

      this.logger.info(`${this.wallet.account.address} | Mint «${nftName}»`);

      let isSuccess = false;
      let retryCount = 1;

      while (!isSuccess) {
        try {
          const txHash = await this.wallet.writeContract({
            address: this.nftContract,
            abi: zoraErc1155Abi,
            functionName: 'mint',
            args: [this.zoraCreator, 1, 1, [this.zoraLink], encodedArguments],
            value: Number(mintFee),
          });
          isSuccess = true;
          this.logger.info(
            `${this.wallet.account.address} | Success mint: https://etherscan.io/tx/${txHash}`
          );
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
