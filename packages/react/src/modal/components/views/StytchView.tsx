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
      <div
        style={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            // @ts-ignore - TEMP. stytchEmail isn't a global class var
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <label>First, enter your email:</label>
          <input
            style={{
              width: '100%',
              borderRadius: '2px',
              background: '#0000005c',
              padding: '1rem',
            }}
            placeholder="Enter email"
            id="stytch-sendEmail-input"
          ></input>
          <button
            style={{
              width: '100%',
              borderRadius: '2px',
              background: '#0000005c',
              padding: '1rem',
            }}
            id="stytch-sendEmail-button"
          >
            Send
          </button>{' '}
        </div>
        <div
          style={{
            // @ts-ignore - TEMP. stytchEmail isn't a global class var
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <label>Then, enter the OTP sent to your email:</label>
          <input
            style={{
              width: '100%',
              borderRadius: '2px',
              background: '#0000005c',
              padding: '1rem',
            }}
            placeholder="Enter OTP"
            id="stytch-verifyOtp-input"
          ></input>
          <button
            style={{
              width: '100%',
              borderRadius: '2px',
              background: '#0000005c',
              padding: '1rem',
            }}
            id="stytch-verifyOtp-button"
          >
            Verify
          </button>
        </div>
      </div>
    ),
  };
}
