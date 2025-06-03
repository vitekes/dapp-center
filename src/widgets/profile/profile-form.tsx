'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {Textarea} from "@/shared/ui/textarea";

/* ------------------------------------------------------------------ */
/*  Модель данных формы                                               */
/* ------------------------------------------------------------------ */
export interface ProfileFormValues {
    displayName: string;
    bio?: string;                    // сделали опциональным
    email?: string;                  // сделали опциональным
    socials?: { kind: string; url: string }[];
    donationAddresses?: { chainId: number; address: string }[];
    avatarContract?: string;
    avatarTokenId?: string;
    avatarCid?: string;
    privateDataCid?: string;
}

/* ----------------------------- валидация --------------------------- */
const schema = z.object({
    displayName: z.string().min(3, 'Минимум 3 символа'),
    bio: z.string().max(500, 'Максимум 500 символов').optional(),
    email: z.string().email('Некорректный email').optional().or(z.literal('')),
    socials: z
        .array(
            z.object({
                kind: z.string().min(2),
                url: z.string().url(),
            }),
        )
        .optional()
        .default([]),
    donationAddresses: z
        .array(
            z.object({
                chainId: z.coerce.number().int(),
                address: z.string().min(3),
            }),
        )
        .optional()
        .default([]),
    avatarContract: z.string().optional().or(z.literal('')),
    avatarTokenId: z.string().optional().or(z.literal('')),
    avatarCid: z.string().optional().or(z.literal('')),
    privateDataCid: z.string().optional().or(z.literal('')),
});

/* -------------------------- дефолтные значения --------------------- */
export const defaultValues: ProfileFormValues = {
    displayName: '',
    bio: '',
    email: '',
    socials: [],
    donationAddresses: [],
    avatarContract: '',
    avatarTokenId: '',
    avatarCid: '',
    privateDataCid: '',
};

/* ------------------------------------------------------------------ */
/*  Компонент формы                                                   */

/* ------------------------------------------------------------------ */
interface Props {
    defaultValues?: ProfileFormValues;
    loading?: boolean;

    onSubmit(values: ProfileFormValues): void | Promise<void>;
}

export function ProfileForm({defaultValues: dv, loading, onSubmit}: Props) {
    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<ProfileFormValues>({
        defaultValues: dv ?? defaultValues,
        resolver: zodResolver(schema),
    });

    const {fields: socialFields, append: addSocial, remove: rmSocial} =
        useFieldArray({control, name: 'socials'});

    const {
        fields: donationFields,
        append: addDonation,
        remove: rmDonation,
    } = useFieldArray({control, name: 'donationAddresses'});

    return (
        <form
            className="space-y-6 max-w-2xl mx-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* ---------------------- handle / display name ---------------- */}
            <Input
                label="Отображаемое имя"
                error={errors.displayName?.message}
                {...register('displayName')}
            />

            {/* --------------------------- bio ----------------------------- */}
            <Textarea
                label="Био"
                placeholder="Расскажите о себе"
                rows={5}
                {...register('bio')}
            />

            {/* -------------------------- email ---------------------------- */}
            <Input
                label="E-mail"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
            />

            {/* ---------------------- socials ------------------------------ */}
            <section>
                <h3 className="font-medium mb-2">Соцсети</h3>
                {socialFields.map((f, i) => (
                    <div key={f.id} className="grid grid-cols-2 gap-4 mb-2">
                        <Input
                            placeholder="twitter"
                            {...register(`socials.${i}.kind`)}
                        />
                        <Input
                            placeholder="https://twitter.com/…"
                            {...register(`socials.${i}.url`)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => rmSocial(i)}
                        >
                            Удалить
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={() => addSocial({kind: '', url: ''})}>
                    Добавить ссылку
                </Button>
            </section>

            {/* ------------------- donation addresses ---------------------- */}
            <section>
                <h3 className="font-medium mb-2">Donation-адреса</h3>
                {donationFields.map((f, i) => (
                    <div key={f.id} className="grid grid-cols-2 gap-4 mb-2">
                        <Input
                            placeholder="1 (Ethereum Mainnet)"
                            type="number"
                            {...register(`donationAddresses.${i}.chainId`)}
                        />
                        <Input
                            placeholder="0xabc…"
                            {...register(`donationAddresses.${i}.address`)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => rmDonation(i)}
                        >
                            Удалить
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => addDonation({chainId: 1, address: ''})}
                >
                    Добавить адрес
                </Button>
            </section>

            {/* ----------------ார்கள் NFT avatar -------------------------- */}
            <section className="grid grid-cols-2 gap-4">
                <Input
                    label="NFT-контракт"
                    placeholder="0xabc…"
                    {...register('avatarContract')}
                />
                <Input
                    label="Token ID"
                    placeholder="0"
                    {...register('avatarTokenId')}
                />
            </section>

            {/* --------------- IPFS avatar & private data CIDs ------------- */}
            <Input
                label="Avatar CID (IPFS)"
                placeholder="bafy…"
                {...register('avatarCid')}
            />
            <Input
                label="Private data CID"
                placeholder="bafy…"
                {...register('privateDataCid')}
            />

            {/* ------------------------- submit ---------------------------- */}
            <div className="text-right">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Сохранение…' : 'Сохранить'}
                </Button>
            </div>
        </form>
    );
}