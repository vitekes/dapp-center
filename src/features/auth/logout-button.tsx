'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    setLoading(false);
  }

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out…' : 'Logout'}
    </Button>
  );
}
