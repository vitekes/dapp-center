'use client';

import {useAccount} from 'wagmi';
import {useRouter} from 'next/navigation';
import {Button} from '@/shared/ui/button';

interface Props {
    handle: string;
}

/**
 * Компонент, отображаемый, когда профиль не найден.
 * Если подключённый кошелёк совпадает с handle, предлагаем создать профиль.
 */
export function NotFoundProfile({handle}: Props) {
    const {address, isConnected} = useAccount();
    const router = useRouter();

    // пока кошелёк не подключён
    if (!isConnected) {
        return <p className="text-gray-500">Профиль не найден.</p>;
    }

    const isOwner =
        address?.toLowerCase() === handle.toLowerCase() ||
        // пользователи могут заходить как 0x… или по ник-handle
        address?.toLowerCase() === handle.replace(/^0x/, '').toLowerCase();

    if (!isOwner) {
        return <p className="text-gray-500">Профиль не найден.</p>;
    }

    return (
        <div className="space-y-4">
            <p className="text-gray-700">
                Профиль не найден. Похоже, вы ещё не создавали визитку.
            </p>
            <Button onClick={() => router.push('/create-profile')}>Создать профиль</Button>
        </div>
    );
}