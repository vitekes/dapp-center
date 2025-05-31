'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import type { Profile } from '@/entities/profile/model/types';

interface ProfileCardProps {
  profile: Profile;
  className?: string;
}

/**
 * Базовая карточка профиля.
 * Не содержит бизнес-логики, только отображение.
 * Для взаимодействий (edit, follow…) оборачивайте её в виджеты/фичи.
 */
export function ProfileCard({ profile, className }: ProfileCardProps) {
  return (
    <article
      className={clsx(
        'flex flex-col gap-4 rounded-lg border border-gray-200 p-6 shadow-sm',
        className,
      )}
    >
      {/* Аватар */}
      <div className="relative h-24 w-24 self-center overflow-hidden rounded-full border">
        {/* При необходимости замените cid.gateway.url */}
        <Image
          src={`https://ipfs.io/ipfs/${profile.avatarCid}`}
          alt={profile.handle}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* Ник / адрес */}
      <h2 className="text-center text-lg font-semibold">{profile.handle}</h2>

      {/* Bio */}
      {profile.bio && (
        <p className="whitespace-pre-wrap text-sm text-gray-700">
          {profile.bio}
        </p>
      )}

      {/* Соцсети */}
      {profile.links.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-3 text-sm">
          {profile.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {l.kind}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Репутация */}
      <div className="mt-auto text-center text-xs text-gray-500">
        Репутация: {profile.reputation.toString()}
      </div>
    </article>
  );
}