// src/widgets/profile/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import { Profile } from '@/entities/profile/model/types';

interface Props {
    profile: Profile;
}

export function ProfileHeader({profile}: Props) {
    /* ------------------------------------------------------------------ */
    /*  Формируем URL: если avatarCid есть – берём IPFS-шлюз, иначе         */
    /*  подставляем локальную «заглушку».                                   */
    /* ------------------------------------------------------------------ */
    const avatarUrl = profile.avatarCid
        ? `https://ipfs.io/ipfs/${profile.avatarCid}`
        : '/img/default-avatar.svg';

    return (
        <header className="flex flex-col items-center gap-4 text-center">
            <Image
                src={avatarUrl}
                alt={`${profile.handle} avatar`}
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
                priority
            />

            <h1 className="text-2xl font-bold">@{profile.handle}</h1>

            {profile.bio && <p className="max-w-md text-gray-700">{profile.bio}</p>}
        </header>
    );
}