import { Hex } from 'viem';
import crypto from 'crypto';
import { binanceConfig } from '../config';
import { makeLogger } from '../utils/logger';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { random, sleep } from '../utils/common';
import { getEthWalletClient } from '../utils/clients/ethClient';

export class Binance {
  privateKey: Hex;
  binanceEndpoint: string =
    'https://api.binance.com/sapi/v1/capital/withdraw/apply';
  wallet: any;
  network: any;
  coin: string;
  logger: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Binance');
    this.wallet = getEthWalletClient(this.privateKey);

    if (binanceConfig.destNetwork === 'random') {
      this.network =
        binanceConfig.networks[random(0, binanceConfig.networks.length - 1)];
    } else {
      this.network = binanceConfig.networks.find(
        (network) => network === binanceConfig.destNetwork
      );
    }

    this.coin = binanceConfig.coin.toUpperCase();
    this.network = this.network.toUpperCase();
  }

  async withdraw(amount: string) {
    let isSuccess = false;
    let retry = 0;

    const address = this.wallet.account.address;
    const network = this.network;
    const coin = this.coin;
    const value = parseFloat(amount).toFixed(5);

    while (!isSuccess) {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}&coin=${coin}&network=${network}&address=${address}&amount=${value}`;
      const signature = crypto
        .createHmac('sha256', binanceConfig.secret)
        .update(queryString)
        .digest('hex');
      const queryParams = `?${queryString}&signature=${signature}`;

      this.logger.info(
        `${address} | Binance withdraw ${coin} -> ${network}: ${value} ${coin}`
      );

      let agent = null;

      if (binanceConfig.proxy) {
        agent = new HttpsProxyAgent(binanceConfig.proxy);
      }

      await axios
        .post(
          this.binanceEndpoint + queryParams,
          {
            coin: coin,
            network: network,
            address: address,
            amount: value,
          },
          {
            headers: {
              'X-MBX-APIKEY': binanceConfig.key,
            },
          }
        )
        .then((response) => {
          this.logger.info(
            `${address} | Binance withdraw success ${coin} -> ${network}: ${value} ${coin}`
          );
          isSuccess = true;
        })
        .catch(async (error) => {
          if (error.response) {
            this.logger.info(
              `${address} | Binance withdraw error: ${error.response.data.msg}`
            );
          } else {
            this.logger.info(
              `${address} | Binance withdraw error: ${error.toString()}`
            );
          }

          if (retry < 3) {
            retry++;
            this.logger.info(`${address} | Retry withdraw ${retry}/3`);
            await sleep(30 * 1000);
          } else {
            isSuccess = true;
            this.logger.info(`${address} | Withdraw failed`);
          }
        });
    }
  }
}
