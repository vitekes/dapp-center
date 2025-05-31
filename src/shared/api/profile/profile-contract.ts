import { wagmiConfig } from '@/shared/lib/web3/wagmi-config';
import { PROFILE_ADDRESS, PROFILE_ABI } from './profile.common';

/**
 * Конфигурация Profile-контракта для server actions и любых
 * других не-React-модулей.
 */
export const PROFILE_CONTRACT = {
    address: PROFILE_ADDRESS,
    abi: PROFILE_ABI,
    chainId: wagmiConfig.chains[0].id,
} as const;