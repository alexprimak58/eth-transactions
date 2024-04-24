import { Hex } from 'viem';
import crypto from 'crypto';
import { binanceConfig } from '../config';
import { makeLogger } from '../utils/logger';
import axios from 'axios';
import { getBaseWalletClient } from '../utils/chains/baseClient';

export class Binance {
  binanceEndpoint: string =
    'https://api.binance.com/sapi/v1/capital/withdraw/apply';
  privateKey: Hex;
  logger: any;
  baseWallet: any;
  walletAddress: Hex;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('Binance');
    this.baseWallet = getBaseWalletClient(privateKey);
    this.walletAddress = this.baseWallet.account.address;
  }

  async withdraw(amount: string) {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}&coin=ETH&network=Base&address=${
      this.walletAddress
    }&amount=${parseFloat(amount).toFixed(5)}`;
    const signature = crypto
      .createHmac('sha256', binanceConfig.secret)
      .update(queryString)
      .digest('hex');
    const queryParams = `?${queryString}&signature=${signature}`;

    this.logger.info(
      `${this.walletAddress} | Binance withdraw ${parseFloat(amount).toFixed(
        5
      )} ETH`
    );

    axios
      .post(
        this.binanceEndpoint + queryParams,
        {
          coin: 'ETH',
          network: 'Base',
          address: this.walletAddress,
          amount: parseFloat(amount).toFixed(5),
        },
        {
          headers: {
            'X-MBX-APIKEY': binanceConfig.key,
          },
        }
      )
      .then((response) => {
        this.logger.info(`${this.walletAddress} | Binance withdraw success`);
      })
      .catch((error) => {
        this.logger.info(
          `${this.walletAddress} | Binance withdraw error: ${error.toString()}`
        );
      });
  }
}
