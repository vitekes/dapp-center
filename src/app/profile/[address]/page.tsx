'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';   // ◀ добавили useParams
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import type { Profile } from '@/entities/profile/model/types';
import { Spinner } from '@/shared/ui/spinner';
import { Button } from '@/shared/ui/button';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import { NotFoundProfile } from '@/widgets/profile/profile-not-found';

/* ------------------------------------------------------------------ */
/*  Получение профиля из API                                          */
/* ------------------------------------------------------------------ */
async function fetchProfile(handleOrAddress: string): Promise<Profile | null> {
  const res = await fetch(`/api/profiles/${handleOrAddress}`);
  if (!res.ok) return null;
  return (await res.json()) as Profile;
}

/* ------------------------------------------------------------------ */
/*  Страница профиля                                                  */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {           // ◀ убрали props
  const router = useRouter();
  const params = useParams<{ address: string }>(); // ◀ получаем address
  const { address: connectedAddr, isConnected } = useAccount();

  const handleOrAddress = decodeURIComponent(params.address);

  /* --------------------------- запрос ----------------------------- */
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile', handleOrAddress],
    queryFn: () => fetchProfile(handleOrAddress),
  });

  /* ------------------- вычисляем флаги (хуки сверху) -------------- */
  const isOwner = useMemo(() => {
    if (!isConnected || !connectedAddr || !profile) return false;
    return connectedAddr.toLowerCase() === profile.handle.toLowerCase();
  }, [connectedAddr, isConnected, profile]);

  /* ------------------------ состояние UI -------------------------- */
  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </main>
    );
  }

  if (isError || !profile) {
    return <NotFoundProfile handle={handleOrAddress} />;
  }

  return (
    <main className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Профиль</h1>

        {isOwner && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push('/profile/edit')}
          >
            Редактировать
          </Button>
        )}
      </div>

      <ProfileCard profile={profile} />
    </main>
  );
}