'use client';

import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/shared/ui/spinner';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import type { Profile } from '@/entities/profile/model/types';

/* ------------------------------------------------------------------ */
/*  Получаем список профилей из API                                   */
/* ------------------------------------------------------------------ */
async function fetchProfiles(): Promise<Profile[]> {
  const res = await fetch('/api/profiles');
  if (!res.ok) throw new Error('Не удалось загрузить профили');
  return (await res.json()) as Profile[];
}

/* ------------------------------------------------------------------ */
/*  Страница со списком всех профилей                                 */
/* ------------------------------------------------------------------ */
export default function ProfilesPage() {
  const {
    data: profiles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profiles', 'all'],
    queryFn: fetchProfiles,
  });

  /* ------------------------ состояние UI -------------------------- */
  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-600">Ошибка: {(error as Error).message}</p>
      </main>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Пока ни одного профиля не найдено.</p>
      </main>
    );
  }

  /* -------------------------- разметка ---------------------------- */
  return (
    <main className="container mx-auto max-w-6xl p-4">
      <h1 className="mb-8 text-2xl font-semibold">Сообщество</h1>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard key={profile.handle} profile={profile} />
        ))}
      </section>
    </main>
  );
}