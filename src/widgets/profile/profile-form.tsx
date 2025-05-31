'use client';

import React from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/ui/button';
import type { SocialKind } from '@/entities/profile/model/types';

/* ------------------------------------------------------------------ */
/*  Схема данных формы                                                */
/* ------------------------------------------------------------------ */
const schema = z.object({
    displayName: z.string().min(1, 'Укажите имя'),
    socials: z
        .array(
            z.object({
                kind: z.enum(['twitter', 'github', 'telegram', 'other']),
                url: z.string().url('Некорректный URL'),
            }),
        )
        .default([]), // ─► всегда массив на выходе
    donationAddresses: z
        .array(
            z.object({
                chainId: z.number().int().positive(),
                address: z
                    .string()
                    .regex(/^0x[a-fA-F0-9]{40}$/, 'Некорректный адрес'),
            }),
        )
        .default([]), // ─► всегда массив на выходе
    bio: z.string().max(160).optional(),
});

/*  Типы: input (может быть undefined) и output (гарантированные defaults) */
type FormInput = z.input<typeof schema>;
export type ProfileFormValues = z.output<typeof schema>;

/* ------------------------------------------------------------------ */
/*  Props                                                             */

/* ------------------------------------------------------------------ */
interface ProfileFormProps {
    /** create | edit */
    mode: 'create' | 'edit';
    /** начальные данные (для редактирования) */
    initialData?: ProfileFormValues;
    /** внешний submit-обработчик */
    onSubmit: (values: ProfileFormValues) => void | Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Компонент формы профиля                                           */

/* ------------------------------------------------------------------ */
export function ProfileForm({mode, initialData, onSubmit: externalSubmit,}: ProfileFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
    } = useForm<FormInput>({
        resolver: zodResolver(schema),
        defaultValues: initialData, // Zod сам подставит defaults
    });

    /* FieldArray — соцсети */
    const socialsFA = useFieldArray({
        control,
        name: 'socials',
    });

    /* FieldArray — адреса донатов */
    const donationFA = useFieldArray({
        control,
        name: 'donationAddresses',
    });

    /* submit */
    const onSubmit = handleSubmit(async data => {
        // превращаем input → output (defaults гарантированы)
        const values = schema.parse(data);
        await externalSubmit(values);
    });

    /* ---------------------------------------------------------------- */
    /*  UI                                                              */
    /* ---------------------------------------------------------------- */
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* displayName */}
            <div>
                <label className="block text-sm font-medium">Имя</label>
                <input
                    {...register('displayName')}
                    className="mt-1 w-full rounded border px-3 py-2"
                    placeholder="Vitalik"
                />
                {errors.displayName && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.displayName.message}
                    </p>
                )}
            </div>

            {/* bio */}
            <div>
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                    {...register('bio')}
                    rows={3}
                    className="mt-1 w-full rounded border px-3 py-2"
                    placeholder="О себе"
                />
                {errors.bio && (
                    <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>
                )}
            </div>

            {/* socials */}
            <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Ссылки на соцсети</legend>

                {socialsFA.fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                        <select
                            {...register(`socials.${idx}.kind`)}
                            className="w-32 rounded border px-2 py-1 text-sm"
                        >
                            <option value="twitter">Twitter</option>
                            <option value="github">GitHub</option>
                            <option value="telegram">Telegram</option>
                            <option value="other">Другое</option>
                        </select>

                        <input
                            {...register(`socials.${idx}.url`)}
                            className="flex-1 rounded border px-3 py-1 text-sm"
                            placeholder="https://"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => socialsFA.remove(idx)}
                        >
                            ✕
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                        socialsFA.append({kind: 'twitter' as SocialKind, url: ''})
                    }
                >
                    Добавить ссылку
                </Button>

                {errors.socials && (
                    <p className="text-xs text-red-600">Проверьте ссылки</p>
                )}
            </fieldset>

            {/* donation addresses */}
            <fieldset className="space-y-2">
                <legend className="text-sm font-medium">
                    Адреса для донатов
                </legend>

                {donationFA.fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                        <input
                            type="number"
                            {...register(`donationAddresses.${idx}.chainId`, {
                                valueAsNumber: true,
                            })}
                            className="w-24 rounded border px-2 py-1 text-sm"
                            placeholder="1"
                        />

                        <input
                            {...register(`donationAddresses.${idx}.address`)}
                            className="flex-1 rounded border px-3 py-1 text-sm"
                            placeholder="0x…"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => donationFA.remove(idx)}
                        >
                            ✕
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                        donationFA.append({chainId: 1, address: ''})
                    }
                >
                    Добавить адрес
                </Button>

                {errors.donationAddresses && (
                    <p className="text-xs text-red-600">
                        Проверьте адреса
                    </p>
                )}
            </fieldset>

            {/* submit */}
            <Button type="submit" disabled={isSubmitting}>
                {mode === 'create' ? 'Создать профиль' : 'Сохранить изменения'}
            </Button>
        </form>
    );
}