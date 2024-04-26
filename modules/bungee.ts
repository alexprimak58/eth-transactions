import { Hex, PrivateKeyAccount, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import {
  getEthWalletClient,
  getPublicEthClient,
} from '../utils/clients/ethClient';
import { privateKeyToAccount } from 'viem/accounts';
import { binanceConfig, bungeeConfig } from '../config';
import { random, sleep } from '../utils/common';
import axios from 'axios';
import { refill } from '../utils/refill';
import { bungeeAbi } from '../data/abi/bungee';

export class Bungee {
  privateKey: Hex;
  logger: any;
  bungeeContract: Hex = '0xb584D4bE1A5470CA1a8778E9B86c81e165204599';
  randomNetwork: any;
  ethClient: any;
  ethWallet: any;
  walletAddress: Hex;
  account: PrivateKeyAccount;
  destNetwork: number;
  networks = [
    {
      name: 'arbitrum',
      id: 42161,
    },
    {
      name: 'base',
      id: 8453,
    },
    {
      name: 'gnosis',
      id: 100,
    },
    {
      name: 'optimism',
      id: 10,
    },
    {
      name: 'zksync',
      id: 324,
    },
  ];

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Bungee');
    this.ethClient = getPublicEthClient();
    this.ethWallet = getEthWalletClient(privateKey);
    this.account = privateKeyToAccount(privateKey);
    this.walletAddress = this.ethWallet.account.address;

    if (bungeeConfig.destinationNetwork === 'random') {
      this.randomNetwork = this.networks[random(0, this.networks.length - 1)];
    } else {
      this.randomNetwork = this.networks.find(
        (network) => network.name === bungeeConfig.destinationNetwork
      );
    }

    this.destNetwork = this.randomNetwork.id;
  }

  async getLimits() {
    let chainData: any;
    let limits: any;

    await axios.get('https://refuel.socket.tech/chains').then((response) => {
      chainData = response.data.result.find(
        (chain: { name: string }) => chain.name === 'Ethereum'
      );
    });
    console.log(chainData);
    limits = chainData.limits.find(
      (limit: { chainId: number }) => limit.chainId === this.destNetwork
    );

    return limits;
  }

  async refuel(amount: string) {
    const value: bigint = BigInt(parseEther(amount));
    this.logger.info(
      `${this.walletAddress} | Bungee refuel to ${this.randomNetwork.name}`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const txHash = await this.ethWallet.writeContract({
          address: this.bungeeContract,
          abi: bungeeAbi,
          functionName: 'depositNativeToken',
          args: [this.destNetwork, this.walletAddress],
          value: value,
        });

        isSuccess = true;
        this.logger.info(
          `${this.walletAddress} | Success refuel to ${this.randomNetwork.name}: https://etherscan.io/tx/${txHash}`
        );
      } catch (error) {
        this.logger.info(`${this.walletAddress} | Error ${error}`);

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
            `${this.walletAddress} | Wait 30 sec and retry refuel ${retryCount}/3`
          );
          retryCount++;
          await sleep(30 * 1000);
        } else {
          isSuccess = true;
          this.logger.info(`${this.walletAddress} | Refuel unsuccessful, skip`);
        }
      }
    }
  }
}
