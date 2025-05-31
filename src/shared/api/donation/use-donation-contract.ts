'use client';

import { useConfig } from 'wagmi';
import type { Abi } from 'viem';
import { CONTRACTS } from '@/shared/config/contracts';
import donationAbi from '@/abi/DonationContract.json';


export function useDonationContract() {
    const config = useConfig();

    return {
        /** Адрес Donation-контракта в сети по умолчанию */
        address: CONTRACTS.DONATION_CONTRACT as `0x${string}`,
        /** Строго типизированный ABI */
        abi: donationAbi as Abi,
        /** ID сети, с которой сейчас работает Wagmi (берём «первую» активную) */
        chainId: config.chains[0]?.id,
    } as const;
}