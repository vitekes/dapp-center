'use client';

import { useAccount } from 'wagmi';
import { useProfile } from '@/shared/api/profile/use-profile';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import Link from 'next/link';

interface Props {
  /** Чей профиль показываем */
  address: `0x${string}`;
  /** Нужно ли отображать кнопку «Редактировать» (по умолчанию true для владельца) */
  showEditIfOwner?: boolean;
}

export function ProfileWidget({address, showEditIfOwner = true}: Props) {
  const {address: myAddress} = useAccount();
  const {profile, isLoading, error} = useProfile(address);

  /* --------- Loading / error --------- */
  if (isLoading) return <Spinner className="mx-auto"/>;

  if (error) {
    return (
        <p className="text-center text-red-500">
          Не удалось загрузить профиль: {String(error.message ?? error)}
        </p>
    );
  }

  /* --------- Профиль не создан --------- */
  if (!profile) {
    return (
        <div className="text-center space-y-4">
          <p>Профиль ещё не создан.</p>

          {showEditIfOwner && myAddress === address && (
              <Button asChild>
                <Link href="/profile/create">Создать профиль</Link>
              </Button>

          )}
        </div>
    );
  }

  /* --------- Профиль существует --------- */
  return (
      <>
        <ProfileCard profile={profile}/>

        {showEditIfOwner && myAddress === address && (
            <div className="mt-6 text-right">
              <Button asChild>
                <Link href="/profile/edit">Редактировать</Link>
              </Button>
            </div>
        )}
      </>
  );
}