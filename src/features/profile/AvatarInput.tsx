'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { AvatarUpload } from './AvatarUpload';
import type { ProfileFormValues } from '@/widgets/profile/profile-form';

/**
 * Адаптер между AvatarUpload и react-hook-form.
 * В состоянии формы хранится только CID изображения (avatarCid).
 *
 * NB: файл имеет расширение .tsx, иначе JSX-синтаксис не распознаётся
 * и TypeScript выдаст десятки ошибок вида «'>' expected».
 */
export function AvatarInput() {
  // получаем control из контекста родительского <FormProvider>
  const { control } = useFormContext<ProfileFormValues>();

  return (
    <Controller
      name="avatarCid"
      control={control}
      render={({ field: { value, onChange } }) => (
        <AvatarUpload
          initialCid={value}
          onUploaded={(cid /* blurHash, lqip */) => onChange(cid)}
        />
      )}
    />
  );
}