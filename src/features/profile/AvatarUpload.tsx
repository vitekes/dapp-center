'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useIpfsUpload } from '@/shared/hooks/useIpfsUpload';
import { generateBlurhash } from '@/shared/lib/generateBlurhash';
import { Button } from '@/shared/ui/button';

interface Props {
    initialCid?: string;
    onUploaded: (cid: string, blurHash?: string, lqip?: string) => void;
}

export function AvatarUpload({initialCid, onUploaded}: Props) {
    const [preview, setPreview] = useState<string | null>(
        initialCid ? `https://ipfs.io/ipfs/${initialCid}` : null,
    );
    const {upload, progress, isUploading, error} = useIpfsUpload();

    const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // ⬇️ вызываем функцию напрямую, без динамического импорта
            const [{hash, lqip}, cid] = await Promise.all([
                generateBlurhash(file),
                upload(file),
            ]);

            onUploaded(cid, hash, lqip);
            setPreview(URL.createObjectURL(file));
        } catch {
            /* ошибки уже обработаны в useIpfsUpload */
        }
    };

    return (
        <div className="space-y-2">
            {preview && (
                <Image
                    src={preview}
                    alt="avatar preview"
                    width={112}
                    height={112}
                    className="rounded-full"
                />
            )}

            <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleSelect}
                className="hidden"
            />

            <label htmlFor="avatar-input">
                <Button asChild>
          <span>
            {isUploading ? `Загрузка… ${progress}%` : 'Загрузить аватар'}
          </span>
                </Button>
            </label>

            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    );
}