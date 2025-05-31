// src/shared/api/getProfile.ts
import {Profile} from '@/entities/profile/model/types';

export async function getProfile(handle: string): Promise<Profile | null> {
    if (handle !== 'demo') return null;

    return {
        handle: 'demo',
        bio: 'Демо-пользователь нашего приложения 👋',
        email: 'demo@example.org',
        avatar: 'https://picsum.photos/200',       // либо CID -> gateway URL
        avatarCid: 'bafy…',
        privateDataCID: 'bafy…',
        links: [
            {kind: 'twitter', url: 'https://twitter.com/demo'},
            {kind: 'github', url: 'https://github.com/demo'},
        ],
        donationAddrs: [
            {chainId: 1, address: '0x1234…'},
            {chainId: 137, address: '0xABCD…'},
        ],
        reputation: 0,
    };
}