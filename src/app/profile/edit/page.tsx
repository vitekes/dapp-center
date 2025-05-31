'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

import { ProfileForm, ProfileFormValues } from '@/widgets/profile/profile-form';
import { useUpdateProfile } from '@/shared/api/profile/use-update-profile';
import { Spinner } from '@/shared/ui/spinner';
import type { Profile } from '@/entities/profile/model/types'; // <── заменяем any

/* ------------------------------------------------------------------ */
/*  Запрос профиля текущего адреса                                    */
/* ------------------------------------------------------------------ */
async function fetchProfile(address: string): Promise<Profile | null> {
  const res = await fetch(`/api/profiles/${address}`);
  if (!res.ok) return null;
  return (await res.json()) as Profile;
}

/* ------------------------------------------------------------------ */
/*  Приведение Profile → ProfileFormValues                            */
/* ------------------------------------------------------------------ */
function mapProfileToFormValues(profile: Profile): ProfileFormValues {
  return {
    displayName: profile.handle,
    bio: profile.bio ?? '',
            socials: profile.links.map(l => ({ kind: l.kind, url: l.url })),
    donationAddresses: profile.donationAddrs.map(d => ({
      chainId: d.chainId,
      address: d.address,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Страница редактирования профиля                                   */
/* ------------------------------------------------------------------ */
export default function EditProfilePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { update, isPending: isUpdating, error: updateErr } =
    useUpdateProfile();

  /* ------------------------- загрузка профиля ---------------------- */
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile', address],
    enabled: Boolean(address),
    queryFn: () => fetchProfile(address as string),
  });

  /* если кошелёк не подключён — просим подключиться */
  useEffect(() => {
    if (!isConnected) {
      toast.error('Сначала подключите кошелёк');
      router.push('/'); // или открыть модал RainbowKit
    }
  }, [isConnected, router]);

  /* ----------------------------------------------------------------
   *  submit
   * ---------------------------------------------------------------- */
  async function handleUpdate(values: ProfileFormValues) {
    if (!isConnected || !address) {
      toast.error('Сначала подключите кошелёк');
      return;
    }

    try {
      await update({
        handle: values.displayName.toLowerCase(),
        bio: values.bio ?? '',
        email: '',
        links: values.socials.map(l => ({ kind: l.kind, url: l.url })),
        avatar: '', // пока без NFT-аватара
        donationAddrs: values.donationAddresses.map(d => ({
          chainId: d.chainId,
          address: d.address,
        })),
        avatarCid: '',
        privateDataCID: '',
      });

      toast.success('Профиль обновлён!');
      router.push(`/profiles/${values.displayName}`);
    } catch (e) {
      console.error(e);
      toast.error('Не удалось сохранить изменения');
    }
  }

  /* ----------------------------------------------------------------
   *  UI
   * ---------------------------------------------------------------- */
  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="container mx-auto max-w-2xl py-8 px-4">
        <h1 className="mb-4 text-2xl font-semibold">Профиль не найден</h1>
        <p className="text-gray-600">
          Мы не смогли загрузить данные профиля для указанного кошелька.
        </p>
      </main>
    );
  }

  const initialData = mapProfileToFormValues(profile);

  return (
    <main className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="mb-6 text-2xl font-semibold">Редактирование профиля</h1>

      <ProfileForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleUpdate}
      />

      {/* Индикаторы статуса обновления */}
      {isUpdating && (
        <p className="mt-4 text-sm text-gray-500">Подтвердите транзакцию…</p>
      )}
      {updateErr && (
        <p className="mt-4 text-sm text-red-600">{updateErr.message}</p>
      )}
    </main>
  );
}