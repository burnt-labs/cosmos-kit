import {
  ChainRecord,
  ChainWalletBase,
  Mutable,
  State,
  Wallet,
} from '@cosmos-kit/core';
import { BurntClient } from './client';

export interface BurntConnectOptions {
  publicKey: string;
}

export class ChainBurntExtension extends ChainWalletBase {
  BurntClient: BurntClient;
  clientMutable: Mutable<BurntClient> = { state: State.Init };

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }

  setClientNotExist() {
    this.setState(State.Error);
    this.setMessage(this.clientMutable.message);
  }
}
