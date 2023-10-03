import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { OfflineAminoSigner, StdSignature, StdSignDoc } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  ChainRecord,
  DappEnv,
  DirectSignDoc,
  ExtendedHttpEndpoint,
  Logger,
  Mutable,
  SignOptions,
  SignType,
  State,
  SuggestToken,
  Wallet,
  WalletClient,
} from '@cosmos-kit/core';
import { BroadcastMode, Keplr } from '@keplr-wallet/types';
import { StytchUIClient } from '@stytch/vanilla-js';
import { BurntConnectOptions } from './chain-wallet';
import { WalletClientActions } from './types';
import SignClient from '@walletconnect/sign-client';
import EventEmitter from 'events';

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

function waitForEmailToContinue() {
  return new Promise((resolve) => {
    window?.document
      ?.getElementById('stytch-sendEmail-button')
      .addEventListener(
        'click',
        function (e) {
          const email = window?.document?.getElementById(
            'stytch-sendEmail-input'
            // @ts-ignore
          ).value;
          resolve(email);
        },
        { once: true }
      ); //Event listener is removed after one call
  });
}

function waitForOtpToContinue() {
  return new Promise((resolve) => {
    window.document.getElementById('stytch-verifyOtp-button').addEventListener(
      'click',
      function (e) {
        const otp = window?.document?.getElementById(
          'stytch-verifyOtp-input'
          // @ts-ignore
        ).value;
        resolve(otp);
      },
      { once: true }
    ); //Event listener is removed after one call
  });
}

export class BurntClient implements WalletClient {
  readonly walletInfo: Wallet;

  signClient?: SignClient;

  actions?: WalletClientActions;
  stytchState: Mutable<string>;

  jwt: string;

  emitter?: EventEmitter;
  logger?: Logger;
  options?: BurntConnectOptions;
  relayUrl?: string;
  env?: DappEnv;
  requiredNamespaces?: {
    methods: string[];
    events: string[];
  };

  readonly client: Keplr;
  readonly stytch: StytchUIClient;
  method_id: string;

  constructor(walletInfo: Wallet, stytch: StytchUIClient) {
    this.walletInfo = walletInfo;

    this.stytch = stytch;
    this.stytchState = { state: State.Init };
  }

  setActions(actions: WalletClientActions) {
    this.actions = actions;
  }

  setStytchState(state: State) {
    this.stytchState.state = state;
    this.actions?.stytchState?.state(state);
  }

  get getJwt() {
    return this.jwt;
  }

  get displayStytchLogin() {
    if (this.jwt) {
      return false;
    } else {
      return true;
    }
  }

  async connect() {
    if (this.stytchState.state !== 'Init') {
      this.setStytchState(State.Init);
    }

    if (this.displayStytchLogin) {
      this.setStytchState(State.Pending);
    }
    await delay(5000);
    const email = await waitForEmailToContinue();
    await this.sendEmail(email as string);
    const otp = await waitForOtpToContinue();
    await this.verifyOTP(otp as string);
    this.setStytchState(State.Init);
  }

  async sendEmail(email: string) {
    try {
      const foo = await this.stytch.otps.email.loginOrCreate(email, {
        expiration_minutes: 5,
      });
      this.method_id = foo.method_id;
      return;
    } catch (error) {
      console.log('SEND EMAIL ERROR: ', error);
    }
  }

  async verifyOTP(otp: string) {
    try {
      const foo = await this.stytch.otps.authenticate(otp, this.method_id, {
        session_duration_minutes: 60,
      });
      this.jwt = foo.session_jwt;

      this.setStytchState(State.Init);
      console.log(foo);
    } catch (error) {
      console.log('SEND EMAIL ERROR: ', error);
    }
  }

  async enable(chainIds: string | string[]) {
    // await this.client.enable(chainIds);
  }

  async suggestToken({ chainId, tokens, type }: SuggestToken) {
    if (type === 'cw20') {
      for (const { contractAddress, viewingKey } of tokens) {
        // await this.client.suggestToken(chainId, contractAddress, viewingKey);
      }
    }
  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  async getAccount(chainId: string) {
    // const key = await this.client.getKey(chainId);
    const key = {} as any;
    return {
      username: key.name,
      address: key.bech32Address,
      algo: key.algo as Algo,
      pubkey: key.pubKey,
    };
  }

  // getOfflineSigner(chainId: string, preferredSignType?: SignType) {
  //   switch (preferredSignType) {
  //     case 'amino':
  //       return this.getOfflineSignerAmino(chainId);
  //     case 'direct':
  //       return this.getOfflineSignerDirect(chainId);
  //     default:
  //       return this.getOfflineSignerAmino(chainId);
  //   }
  //   // return this.client.getOfflineSignerAuto(chainId);
  // }

  // getOfflineSignerAmino(chainId: string): OfflineAminoSigner {
  //   return {
  //     getAccounts: async () => {
  //       return [await this.getAccount(chainId)];
  //     },
  //     signAmino: async (signerAddress, signDoc) => {
  //       return this.signAmino(chainId, signerAddress, signDoc, {
  //         preferNoSetFee: true,
  //         preferNoSetMemo: true,
  //         disableBalanceCheck: true,
  //       });
  //     },
  //   };
  //   // return this.client.getOfflineSignerOnlyAmino(chainId);
  // }

  // getOfflineSignerDirect(chainId: string): OfflineDirectSigner {
  //   return {
  //     getAccounts: async () => {
  //       return [await this.getAccount(chainId)];
  //     },
  //     signDirect: async (signerAddress, signDoc) => {
  //       return this.signDirect(chainId, signerAddress, signDoc, {
  //         preferNoSetFee: true,
  //         preferNoSetMemo: true,
  //         disableBalanceCheck: true,
  //       });
  //     },
  //   };
  //   // return this.client.getOfflineSigner(chainId) as OfflineDirectSigner;
  // }

  // async addChain(chainInfo: ChainRecord) {
  //   const suggestChain = chainRegistryChainToKeplr(
  //     chainInfo.chain,
  //     chainInfo.assetList ? [chainInfo.assetList] : []
  //   );

  //   if (chainInfo.preferredEndpoints?.rest?.[0]) {
  //     (suggestChain.rest as string | ExtendedHttpEndpoint) =
  //       chainInfo.preferredEndpoints?.rest?.[0];
  //   }

  //   if (chainInfo.preferredEndpoints?.rpc?.[0]) {
  //     (suggestChain.rpc as string | ExtendedHttpEndpoint) =
  //       chainInfo.preferredEndpoints?.rpc?.[0];
  //   }

  //   await this.client.experimentalSuggestChain(suggestChain);
  // }

  // async signAmino(
  //   chainId: string,
  //   signer: string,
  //   signDoc: StdSignDoc,
  //   signOptions?: SignOptions
  // ) {
  //   return await this.client.signAmino(chainId, signer, signDoc, signOptions);
  // }

  // async signArbitrary(
  //   chainId: string,
  //   signer: string,
  //   data: string | Uint8Array
  // ): Promise<StdSignature> {
  //   return await this.client.signArbitrary(chainId, signer, data);
  // }

  // async signDirect(
  //   chainId: string,
  //   signer: string,
  //   signDoc: DirectSignDoc,
  //   signOptions?: SignOptions
  // ) {
  //   return await this.client.signDirect(chainId, signer, signDoc, signOptions);
  // }

  // async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
  //   return await this.client.sendTx(chainId, tx, mode);
  // }
}
