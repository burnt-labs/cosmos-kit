import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const burntExtensionInfo: Wallet = {
  name: 'stytch',
  prettyName: 'Stytch',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: false,
  connectEventNamesOnWindow: ['stytch_keystorechange'],
};
