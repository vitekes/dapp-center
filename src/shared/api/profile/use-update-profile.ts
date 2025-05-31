'use client';

import { useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useProfileContract } from '@/shared/api/profile/use-profile-contract';
import type { Profile } from '@/entities/profile/model/types';

/**
 * Хук для вызова updateProfile(...) в смарт-контракте.
 */
export function useUpdateProfile() {
  const contract = useProfileContract();

  const {
    data: hash,
    isPending: isSigning,
    writeContractAsync,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isMining, error: txError } =
    useWaitForTransactionReceipt({ hash, chainId: contract.chainId });

  const update = useCallback(
    async (profile: Omit<Profile, 'reputation'>) => {
      await writeContractAsync({
        ...contract,
        functionName: 'setProfile',
        args: [
          profile.handle,
          profile.bio,
          profile.email,
          profile.links,
          profile.avatar,
          profile.donationAddrs,
          profile.avatarCid,
          profile.privateDataCID,
        ],
      });
    },
    [contract, writeContractAsync],
  );

  return {
    update,
    isPending: isSigning || isMining,
    error: writeError ?? txError,
  } as const;
}