'use client';

import { useReadContract } from 'wagmi';
import { useProfileContract } from '@/shared/api/profile/use-profile-contract';
import type { Profile } from '@/entities/profile/model/types';

/**
 * Хук читает on-chain-профиль конкретного пользователя.
 * @param user адрес пользователя, чей профиль нужно получить
 */
export function useProfile(user: `0x${string}`) {
    /* конфигурация (адрес + abi + chainId) */
    const contract = useProfileContract();

    /* Запрашиваем данные из метода `getProfile(address)` */
    const {
        data,        // исходный tuple из контракта
        isLoading,
        error,
    } = useReadContract({
        ...contract,
        functionName: 'getProfile',
        args: [user],
    });

    /* Если data ещё нет или вернулось что-то неожиданное — profile = undefined */
    const profile: Profile | undefined = Array.isArray(data)
        ? {
            handle: data[0] as string,
            bio: data[1] as string,
            email: data[2] as string,
            links: data[3] as Profile['links'],
            avatar: data[4] as Profile['avatar'],
            donationAddrs: data[5] as Profile['donationAddrs'],
            reputation: BigInt(data[6] as unknown as string | number), // приводим к bigint
            avatarCid: data[7] as string,
            privateDataCID: data[8] as string,
        }
        : undefined;

    return {profile, isLoading, error};
}