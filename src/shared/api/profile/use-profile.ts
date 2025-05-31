'use client';

import { useReadContract } from 'wagmi';
import { useProfileContract } from './use-profile-contract';
import type { Profile } from '@/entities/profile/model/types';

/**
 * Читает on-chain-профиль пользователя.
 * Если параметр не передан – запрос не выполняется.
 */
export function useProfile(user?: `0x${string}`) {
  const contract = useProfileContract();

  const {
    data,
    isLoading,
    error,
  } = useReadContract({
    ...contract,
    functionName: 'getProfile',
    args: [user ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: Boolean(user) },   // 🔑 не дергаем контракт без адреса
  });

  const profile: Profile | undefined = Array.isArray(data)
    ? {
        handle: data[0] as string,
        bio: data[1] as string,
        email: data[2] as string,
        links: data[3] as Profile['links'],
        avatar: data[4] as Profile['avatar'],
        donationAddrs: data[5] as Profile['donationAddrs'],
        reputation: BigInt(data[6] as unknown as string | number),
        avatarCid: data[7] as string,
        privateDataCID: data[8] as string,
      }
    : undefined;

  return { profile, isLoading, error };
}