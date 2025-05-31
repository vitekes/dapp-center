'use client';

'use client';

import { useConfig } from 'wagmi';
import type { Abi } from 'viem';
import { CONTRACTS } from '@/shared/config/contracts';
import badgeAbi from '@/abi/SoulboundBadge.json';


export function useDonationContract() {
    const config = useConfig();

    return {
        /** Адрес SoulboundBadge-контракта в сети по умолчанию */
        address: CONTRACTS.SOULBOUND_BADGE as `0x${string}`,
        /** Строго типизированный ABI */
        abi: badgeAbi as Abi,
        /** ID сети, с которой сейчас работает Wagmi (берём «первую» активную) */
        chainId: config.chains[0]?.id,
    } as const;
}

