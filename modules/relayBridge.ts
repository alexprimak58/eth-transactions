import { Hex, formatEther, parseEther } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import {
  MAINNET_RELAY_API,
  ProgressData,
  convertViemChainToRelayChain,
  createClient,
  getClient,
} from '@reservoir0x/relay-sdk';
import { arbitrum, base, linea, mainnet, optimism, zkSync } from 'viem/chains';
import { random, sleep } from '../utils/common';
import { relayBridgeConfig } from '../config';
import { getArbWalletClient } from '../utils/clients/arbitrum';
import { getBaseWalletClient } from '../utils/clients/base';
import { getOptWalletClient } from '../utils/clients/optimism';
import { getZkWalletClient } from '../utils/clients/zkSync';
import { getLineaWalletClient } from '../utils/clients/linea';

interface Quote {
  fees: {
    gas: string;
    relayer: string;
  };
}

export class RelayBridge {
  privateKey: Hex;
  logger: any;
  wallet: any;
  ethWallet: any;
  fromNetwork: any;
  destNetwork: any;
  scanUrl: any;

  constructor(privateKey: Hex, fromNetwork?: string) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Relay bridge');
    this.ethWallet = getEthWalletClient(privateKey);

    if (relayBridgeConfig.destNetwork === 'random') {
      this.destNetwork =
        relayBridgeConfig.destNetworks[
          random(0, relayBridgeConfig.destNetworks.length - 1)
        ];
    } else {
      this.destNetwork = relayBridgeConfig.destNetworks.find(
        (network) => network.name === relayBridgeConfig.destNetwork
      );
    }

    if (!fromNetwork) {
      this.fromNetwork = relayBridgeConfig.fromNetwork;
    } else {
      this.fromNetwork = fromNetwork;
    }

    if (this.fromNetwork === 'random') {
      this.fromNetwork =
        relayBridgeConfig.fromNetworks[
          random(0, relayBridgeConfig.fromNetworks.length - 1)
        ];
    } else {
      this.fromNetwork = relayBridgeConfig.fromNetworks.find(
        (network) => network.name === fromNetwork
      );
    }

    switch (this.fromNetwork.id) {
      case 42161:
        this.wallet = getArbWalletClient(privateKey);
        this.scanUrl = 'https://arbiscan.io/tx';
        break;
      case 8453:
        this.wallet = getBaseWalletClient(privateKey);
        this.scanUrl = 'https://basescan.org/tx';
        break;
      case 59144:
        this.wallet = getLineaWalletClient(privateKey);
        this.scanUrl = 'https://lineascan.build/tx';
        break;
      case 10:
        this.wallet = getOptWalletClient(privateKey);
        this.scanUrl = 'https://optimistic.etherscan.io/tx';
        break;
      case 324:
        this.wallet = getZkWalletClient(privateKey);
        this.scanUrl = 'https://explorer.zksync.io/tx';
        break;
    }

    createClient({
      baseApiUrl: MAINNET_RELAY_API,
      source: 'YOUR.SOURCE',
      chains: [
        convertViemChainToRelayChain(mainnet),
        convertViemChainToRelayChain(arbitrum),
        convertViemChainToRelayChain(base),
        convertViemChainToRelayChain(optimism),
        convertViemChainToRelayChain(zkSync),
        convertViemChainToRelayChain(linea),
      ],
    });
  }

  async bridgeFromEth(amount: string) {
    const value: bigint = BigInt(parseEther(amount));
    const destNetworkName = this.destNetwork.name;
    const destNetworkId = this.destNetwork.id;

    this.logger.info(
      `${this.ethWallet.account.address} | Relay bridge Ethereum -> ${destNetworkName} ${amount} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        const data = (await getClient()?.actions.bridge({
          wallet: this.ethWallet,
          chainId: 1,
          toChainId: destNetworkId,
          amount: value.toString(),
          currency: 'eth',
        })) as ProgressData;

        isSuccess = true;

        this.logger.info(
          `${this.ethWallet.account.address} | Success bridge Ethereum -> ${destNetworkName}: https://etherscan.io/tx/${data.txHashes?.[0].txHash}`
        );
      } catch (error) {
        this.logger.info(
          `${this.ethWallet.account.address} | Error ${error.shortMessage}`
        );

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
          `${this.ethWallet.account.address} | Relay bridge error: ${error.shortMessage}`
        );
      }
    }
  }

  async bridgeToEth(amount: string) {
    let value: bigint = BigInt(parseEther(amount));
    const fromNetworkName = this.fromNetwork.name;
    const fromNetworkId = this.fromNetwork.id;
    const scanUrl = this.scanUrl;

    const quote = (await getClient()?.methods.getBridgeQuote({
      wallet: this.wallet,
      chainId: fromNetworkId,
      toChainId: 1,
      amount: value.toString(),
      currency: 'eth',
    })) as Quote;

    const fee = BigInt(quote.fees.gas) + BigInt(quote.fees.relayer);

    value = value - fee;

    this.logger.info(
      `${
        this.wallet.account.address
      } | Relay bridge ${fromNetworkName} -> Ethereum ${formatEther(value)} ETH`
    );

    let isSuccess = false;
    let retryCount = 1;

    while (!isSuccess) {
      try {
        (await getClient()?.actions.bridge({
          wallet: this.wallet,
          chainId: fromNetworkId,
          toChainId: 1,
          amount: value.toString(),
          currency: 'eth',
          onProgress: ({ steps, txHashes }) => {
            if (
              steps.find((step) =>
                step.items?.every((item) => item.status === 'complete')
              )
            ) {
              isSuccess = true;
              this.logger.info(
                `${this.wallet.account.address} | Success bridge ${fromNetworkName} -> Ethereum: ${scanUrl}/${txHashes?.[0].txHash}`
              );
            }
          },
        })) as ProgressData;
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
          `${this.wallet.account.address} | Relay bridge error: ${error.shortMessage}`
        );
      }
    }
  }
}
