'use client';

import { SocialLink, SocialKind } from '@/entities/profile/model/types';
import {
    TwitterIcon,       // не-deprecated
    GithubIcon,        // deprecated в 0.511.0, но другого пока нет
    Link as LinkIcon,
    type LucideIcon,
} from 'lucide-react';

interface Props {
    links: SocialLink[];
}

const icons = {
    twitter: TwitterIcon,
    github: GithubIcon,
    telegram: LinkIcon,
    other: LinkIcon,
} as const satisfies Record<SocialKind, LucideIcon>;

export function SocialLinks({links}: Props) {
    if (!links.length)
        return <p className="text-gray-500">Пользователь ничего не добавил.</p>;

    return (
        <ul className="flex flex-wrap gap-3">
            {links.map(({kind, url}) => {
                const Icon = icons[kind];
                return (
                    <li key={url}>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                            <Icon size={16}/> {kind}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}