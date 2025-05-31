'use client';

import { useConfig } from 'wagmi';
import { PROFILE_ADDRESS, PROFILE_ABI } from './profile.common';

/**
 * Хук возвращает конфигурацию Profile-контракта, «чувствительную»
 * к текущей активной сети пользователя.
 */
export function useProfileContract() {
  const { chains } = useConfig();

  return {
    address: PROFILE_ADDRESS,
    abi: PROFILE_ABI,
    chainId: chains[0]?.id,
  } as const;
}