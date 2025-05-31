'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { getProfile } from '@/shared/api/getProfile';

/**
 * Кнопка «Мой профиль».
 * Показывается только когда кошелёк подключён.
 * При нажатии пытается определить handle пользователя и ведёт на
 * /profiles/<handle>. Если handle не найден, идём по адресу.
 */
export function MyProfileNavButton() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      // ⚠️ пример: предполагаем, что getProfile вернёт объект с полем handle
      const profile = await getProfile(address);
      const handle = profile?.handle ?? address;

      router.push(`/profiles/${handle}`);
    } finally {
      setLoading(false);
    }
  }, [address, router]);

  if (!isConnected) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-sm text-gray-700 hover:text-black transition-colors disabled:opacity-60"
    >
      {loading ? 'Загрузка…' : 'Мой профиль'}
    </button>
  );
}