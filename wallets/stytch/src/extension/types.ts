import { ChainRecord, StateActions, Wallet } from '@cosmos-kit/core';
import { ChainBurntExtension } from './chain-wallet';
import { BurntClient } from './client';

export interface IBurntClient {
  new (walletInfo: Wallet): BurntClient;
}

export interface IChainBurnt {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainBurntExtension;
}

export interface WalletClientActions {
  stytchState?: StateActions<string>;
}
