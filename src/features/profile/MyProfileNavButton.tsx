'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useProfile } from '@/shared/api/profile/use-profile';

/**
 * Кнопка/ссылка «Мой профиль».
 * Показывается только после подключения кошелька.
 */
export function MyProfileNavButton() {
  const { address, isConnected } = useAccount();

  /* ⬇️ Хук вызывается ВСЕГДА, адрес может быть undefined */
  const { profile, isLoading } = useProfile(address as `0x${string}` | undefined);

  /* Если кошелёк не подключён – ничего не отображаем */
  if (!isConnected) return null;

  const target = profile?.handle
    ? `/profiles/${profile.handle}`
    : `/profiles/${address}`;

  return (
    <Link
      href={target}
      className="text-sm text-gray-700 transition-colors hover:text-black opacity-90 data-[loading=true]:opacity-60"
      data-loading={isLoading}
    >
      {isLoading ? 'Загрузка…' : 'Мой профиль'}
    </Link>
  );
}