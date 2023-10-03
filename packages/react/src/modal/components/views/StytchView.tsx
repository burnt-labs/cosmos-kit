import { WalletViewProps } from '@cosmos-kit/core';
import { ConnectModalHead } from '@interchain-ui/react';

import { ModalViewImpl } from './config';

export function StytchView({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps): ModalViewImpl {
  const {
    walletInfo: { prettyName },
  } = wallet;

  // Can't use useState in this file without throwing a order of hooks error

  return {
    head: (
      <ConnectModalHead
        title={prettyName}
        hasBackButton={true}
        onClose={onClose}
        onBack={onReturn}
      />
    ),
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input placeholder="Enter email" id="stytch-sendEmail-input"></input>
        <button id="stytch-sendEmail-button">Send</button>

        <input placeholder="Enter OTP" id="stytch-verifyOtp-input"></input>
        <button id="stytch-verifyOtp-button">Verify</button>
      </div>
    ),
  };
}
