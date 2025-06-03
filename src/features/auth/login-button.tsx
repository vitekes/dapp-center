'use client';

import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Button } from '@/shared/ui/button';

export function LoginButton() {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!isConnected || !address) return;
    setLoggingIn(true);
    setError(null);

    try {
      const nonceRes = await fetch('/api/auth/nonce');
      const { nonce } = await nonceRes.json();
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to DApp Center.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
      const signature = await signMessageAsync({ message: message.prepareMessage() });
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      if (!loginRes.ok) {
        throw new Error('Invalid signature');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleLogin} disabled={!isConnected || loggingIn}>
        {loggingIn ? 'Signing…' : 'Sign In'}
      </Button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
