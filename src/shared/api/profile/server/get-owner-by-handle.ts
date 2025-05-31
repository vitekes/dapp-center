'use server';

import { getPublicClient } from 'wagmi/actions';
import { wagmiConfig } from '@/shared/lib/web3/wagmi-config';
import { PROFILE_CONTRACT } from '@/shared/api/profile/profile-contract';

/**
 * Возвращает адрес владельца профиля по `handle`.
 * Если профиль не найден или нет public-клиента, возвращает `null`.
 */
export async function getOwnerByHandle(
    handle: string,
): Promise<`0x${string}` | null> {
    const chainId = wagmiConfig.chains[0].id;

    /* ---------- проверяем, что клиент существует ---------- */
    const clientMaybe = getPublicClient(wagmiConfig, {chainId});
    if (!clientMaybe) {
        console.error('[getOwnerByHandle] Public client not found for chain', chainId);
        return null;
    }
    const client = clientMaybe; // здесь тип: PublicClient

    try {
        const addr = (await client.readContract({
            ...PROFILE_CONTRACT,
            functionName: 'getOwnerByHandle',
            args: [handle],
        })) as `0x${string}`;

        /* Контракт отдаёт «нулевой» адрес, если записи нет */
        return /^0x0{40}$/i.test(addr) ? null : addr;
    } catch (e) {
        console.error('[getOwnerByHandle]', e);
        return null;
    }
}