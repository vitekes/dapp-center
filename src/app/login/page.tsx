'use client';

import { LoginButton } from '@/features/auth/login-button';
import { LogoutButton } from '@/features/auth/logout-button';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/login').then(res => res.json()).then(d => setAddress(d.address));
  }, []);

  return (
    <main className="flex flex-col items-center gap-4 py-20">
      {address ? (
        <>
          <p>Signed in as {address}</p>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}
