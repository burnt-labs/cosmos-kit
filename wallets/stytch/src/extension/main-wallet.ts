import { Mutable, State, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { StytchUIClient } from '@stytch/vanilla-js';

import { BurntConnectOptions, ChainBurntExtension } from './chain-wallet';
import { BurntClient } from './client';
import { IBurntClient } from './types';

export class BurntExtensionWallet extends MainWalletBase {
  BurntClient: IBurntClient;
  clientMutable: Mutable<BurntClient> = { state: State.Init };

  constructor(walletInfo: Wallet, ChainBurnt: ChainBurntExtension) {
    // @ts-ignore
    super(walletInfo, ChainBurnt);
  }

  async initClient(options?: BurntConnectOptions) {
    // if (!options) {
    //   this.initClientError(
    //     new Error('`walletconnectOptions` is not provided.')
    //   );
    //   return;
    // }

    // if (!options.publicKey) {
    //   this.initClientError(
    //     new Error('`publicKey` is not provided in `walletconnectOptions`.')
    //   );
    //   return;
    // }

    this.initingClient();

    try {
      const stytch = new StytchUIClient(
        'public-token-test-62177c24-f8f4-4ddd-962b-0436b445ccaa'
      );
      const client = new BurntClient(this.walletInfo, stytch);
      client.logger = this.logger;
      client.emitter = this.emitter;
      client.env = this.env;
      client.options = options;

      this.initClientDone(client);
    } catch (error) {
      this.initClientError(error);
    }
  }
}
