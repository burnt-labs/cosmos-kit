import {
  BurntExtensionWallet,
  burntExtensionInfo,
  ChainBurntExtension,
} from './extension';

const burntExtension = new BurntExtensionWallet(
  burntExtensionInfo,
  // @ts-ignore - throws an error that the type is wrong but it works
  ChainBurntExtension
);

export const wallets = [burntExtension];
