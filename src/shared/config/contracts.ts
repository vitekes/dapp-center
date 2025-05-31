/**
 * Единая точка, где хранятся адреса всех задеплоенных контрактов.
 * Значения подтягиваются из `.env.local` (Next.js автоматически
 * прокидывает переменные с префиксом `NEXT_PUBLIC_…` в браузер).
 *
 * Не забудьте добавить в `.env.local` строки вида:
 * NEXT_PUBLIC_PROFILE_ADDRESS=0x....
 * NEXT_PUBLIC_SOULBOUND_BADGE_ADDRESS=0x....
 * NEXT_PUBLIC_THIRD_CONTRACT_ADDRESS=0x....
 *
 * Если переменная не определена, оставляем «пустую» заглушку.
 */
export const CONTRACTS = {
    /** Profile.sol */
    PROFILE: (process.env.NEXT_PUBLIC_PROFILE_ADDRESS ?? '0x_PROFILE') as `0x${string}`,

    /** SoulboundBadge.sol */
    SOULBOUND_BADGE: (process.env.NEXT_PUBLIC_SOULBOUND_BADGE_ADDRESS ?? '0x_SOULBOUND_BADGE') as `0x${string}`,

    /** Третий контракт (замените названием на своё) */
    DONATION_CONTRACT: (process.env.NEXT_PUBLIC_THIRD_CONTRACT_ADDRESS ?? '0x_DONATION') as `0x${string}`,
} as const;