   // src/shared/api/contracts/profile.common.ts
   import type { Abi } from 'viem';
   import { CONTRACTS } from '@/shared/config/contracts';
   import profileAbi from '@/abi/Profile.json';

   export const PROFILE_ADDRESS = CONTRACTS.PROFILE as `0x${string}`;
   export const PROFILE_ABI = profileAbi as Abi;