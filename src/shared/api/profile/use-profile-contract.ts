'use client';

import { useChainId } from 'wagmi';
import { PROFILE_ADDRESS, PROFILE_ABI } from './profile.common';

/**
 * Описание контракта Profile.
 * Адрес берётся из .env (NEXT_PUBLIC_PROFILE_ADDRESS).
 * Если переменная не задана или содержит плейсхолдер «0x_PROFILE» —
 * бросаем понятную ошибку, чтобы выше можно было показать тост.
 */
export function useProfileContract() {
    const chainId = useChainId();           // текущая сеть (для viem)

    const address = PROFILE_ADDRESS;        // одна строка, а не map
    const isPlaceholder = /^0x_[A-Z_]+$/.test(address); // «0x_PROFILE» и т.п.

    console.log('useProfileContract', {address, isPlaceholder, chainId});
    if (isPlaceholder) {
        throw new Error(
            'Profile contract address is not configured. ' +
            'Добавьте NEXT_PUBLIC_PROFILE_ADDRESS в .env.local',
        );
    }

    return {
        address,
        abi: PROFILE_ABI,
        chainId,
    } as const;
}