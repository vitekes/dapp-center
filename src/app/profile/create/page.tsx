'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';

import { ProfileForm, ProfileFormValues } from '@/widgets/profile/profile-form';
import { useUpdateProfile } from '@/shared/api/profile/use-update-profile';

/**
 * Страница «Создание профиля».
 * Находится по пути: /profile/create
 */
export default function CreateProfilePage() {
  const router = useRouter();
  const {address, isConnected} = useAccount();
  const {update, isPending, error} = useUpdateProfile();

  /* ----------------------------------------------------------------
   *  Обработка сабмита формы
   * ---------------------------------------------------------------- */
  async function handleCreate(values: ProfileFormValues) {
    if (!isConnected || !address) {
      toast.error('Сначала подключите кошелёк');
      return;
    }

    try {
      await update({
        handle: values.displayName.toLowerCase(), // выберите собственную логику
        bio: values.bio ?? '',
        email: '', // нет email в MVP
        links: values.socials.map(l => ({kind: l.kind, url: l.url})),
        avatar: '', // без NFT-аватара
        donationAddrs: values.donationAddresses.map(d => ({
          chainId: d.chainId,
          address: d.address,
        })),
        avatarCid: '',
        privateDataCID: '',
      });

      toast.success('Профиль создан!');
      router.push(`/profiles/${values.displayName}`);
    } catch (e) {
      console.error(e);
      toast.error('Не удалось создать профиль');
    }
  }

  /* ----------------------------------------------------------------
   *  UI
   * ---------------------------------------------------------------- */
  return (
      <main className="container mx-auto max-w-2xl py-8 px-4">
        <h1 className="mb-6 text-2xl font-semibold">Создание профиля</h1>

        <ProfileForm mode="create" onSubmit={handleCreate}/>

        {/* Индикаторы статуса запроса */}
        {isPending && (
            <p className="mt-4 text-sm text-gray-500">Подтвердите транзакцию…</p>
        )}
        {error && (
            <p className="mt-4 text-sm text-red-600">{error.message}</p>
        )}
      </main>
  );
}