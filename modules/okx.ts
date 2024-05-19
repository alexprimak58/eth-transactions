import { Hex } from 'viem';
import { makeLogger } from '../utils/logger';
import { getEthWalletClient } from '../utils/clients/ethereum';
import ccxt from 'ccxt';
import { okxConfig } from '../config';
import { random } from '../utils/common';
import { HttpsProxyAgent } from 'https-proxy-agent';
import axios from 'axios';
import crypto from 'crypto';

export class OKX {
  privateKey: Hex;
  baseUrl: string = 'https://www.okx.com';
  wallet: any;
  network: any;
  coin: string;
  logger: any;
  exchange: any;

  constructor(privateKey: Hex) {
    this.privateKey = privateKey;
    this.logger = makeLogger('OKX');
    this.wallet = getEthWalletClient(privateKey);
    this.exchange = new ccxt.okx({
      apiKey: okxConfig.key,
      secret: okxConfig.secret,
      password: okxConfig.passphrase,
      enableRateLimit: true,
    });

    if (okxConfig.destNetwork === 'random') {
      this.network =
        okxConfig.destNetworks[random(0, okxConfig.destNetworks.length - 1)];
    } else {
      this.network = okxConfig.destNetwork;
    }

    this.coin = okxConfig.coin.toUpperCase();
  }

  async getWithdrawalFee(symbolWithdraw: string, chainName: string) {
    try {
      switch (chainName) {
        case 'Optimism':
          chainName = 'OPTIMISM';
          break;
        case 'Arbitrum One':
          chainName = 'ARBONE';
          break;
      }
      const currencies = await this.exchange.fetchCurrencies();
      const currencyInfo = currencies[symbolWithdraw];
      if (currencyInfo) {
        const networkInfo = currencyInfo.networks;
        if (networkInfo && networkInfo[chainName]) {
          const withdrawalFee = networkInfo[chainName].fee;
          return withdrawalFee === 0 ? 0 : withdrawalFee;
        }
      }
    } catch (error) {
      this.logger.error('Error:', error.toString());
    }
  }

  async withdraw(amount: string) {
    const address = this.wallet.account.address;
    const network = this.network;
    const coin = this.coin;
    const value = parseFloat(amount).toFixed(5);

    let fee = await this.getWithdrawalFee(coin, network);

    this.logger.info(
      `${address} | OKX withdraw ${coin} -> ${network}: ${value} ${coin}`
    );

    const body = {
      ccy: coin,
      amt: amount,
      dest: '4',
      toAddr: address,
      chain: `${coin}-${network}`,
      walletType: 'private',
      fee: fee,
    };

    let agent = null;

    if (okxConfig.proxy) {
      agent = new HttpsProxyAgent(okxConfig.proxy);
    }

    try {
      const response = await axios.post(
        this.baseUrl + '/api/v5/asset/withdrawal',
        body,
        {
          httpsAgent: agent,
          headers: this.getHeaders(
            'POST',
            '/api/v5/asset/withdrawal',
            '',
            body
          ),
        }
      );

      if (response.data.code) {
        if (response.data.code === '0') {
          this.logger.info(
            `${address} | OKX withdraw success ${coin} -> ${network}: ${value} ${coin}`
          );
        } else {
          this.logger.info(
            `${address} | OKX withdraw unsuccessful: ${response.data.msg}`
          );
        }
      }

      return network;
    } catch (error) {
      if (error.response) {
        this.logger.info(
          `${address} | OKX withdraw error: ${error.response.data.msg}`
        );
      } else {
        this.logger.info(`${address} | OKX withdraw error: ${error}`);
      }
    }
  }

  getHeaders(
    method: string = 'POST',
    endpoint: string,
    params: string = '',
    body: any = ''
  ) {
    const timestamp = new Date().toISOString();
    const preHash =
      timestamp +
      method +
      endpoint +
      (params ? params : '') +
      (body ? JSON.stringify(body) : '');
    const signature = crypto
      .createHmac('sha256', okxConfig.secret)
      .update(preHash)
      .digest('base64');

    return {
      'OK-ACCESS-KEY': okxConfig.key,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': okxConfig.passphrase,
      'Content-Type': 'application/json',
    };
  }

  async transferToMain() {
    let agent = null;

    if (okxConfig.proxy) {
      agent = new HttpsProxyAgent(okxConfig.proxy);
    }

    const subAccounts = await this.getSubAccounts();

    for (let subAccount of subAccounts) {
      const params = `?subAcct=${subAccount.subAcct}`;
      const responseBalances = await axios.get(
        this.baseUrl + '/api/v5/asset/subaccount/balances' + params,
        {
          httpAgent: agent,
          headers: this.getHeaders(
            'GET',
            '/api/v5/asset/subaccount/balances',
            params
          ),
        }
      );

      for (let balance of responseBalances.data.data) {
        let body = {
          ccy: balance.ccy,
          amt: balance.availBalance,
          subAcct: subAccount.subAcct,
          from: '6',
          to: '6',
          type: '2',
        };

        await axios
          .post(this.baseUrl + '/api/v5/asset/transfer', body, {
            httpsAgent: agent,
            headers: this.getHeaders(
              'POST',
              '/api/v5/asset/transfer',
              '',
              body
            ),
          })
          .then((response) => {
            this.logger.info(
              `${subAccount.subAcct} | Transfer to main complete`
            );
          })
          .catch((error) => {
            this.logger.error(`${subAccount.subAcct} | ${error.toString()}`);
          });
      }
    }

    return true;
  }

  async getSubAccounts() {
    let agent = null;

    if (okxConfig.proxy) {
      agent = new HttpsProxyAgent(okxConfig.proxy);
    }

    const response = await axios.get(
      this.baseUrl + '/api/v5/users/subaccount/list',
      {
        httpAgent: agent,
        headers: this.getHeaders('GET', '/api/v5/users/subaccount/list'),
      }
    );

    if (response.data) {
      return response.data.data;
    }

    return [];
  }
}
