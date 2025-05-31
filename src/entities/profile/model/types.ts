/**
 * Перечень поддерживаемых соцсетей.
 * При добавлении новой иконки расширяйте этот union-type.
 */
export type SocialKind = 'twitter' | 'github' | 'telegram' | 'other';

/**
 * Ссылка на соцсеть в профиле пользователя.
 */
export interface SocialLink {
  kind: SocialKind;
  url: string;
}

/**
 * NFT-аватар (кроме обычной картинки можно указать токен).
 */
export interface NFTAvatar {
  uri: string;
  contractAddress: `0x${string}`;
  tokenId: bigint;
}

/**
 * Адрес для пожертвований в разных сетях / валютах.
 */
export interface DonationAddress {
  /** id сети (1 – Mainnet, 137 – Polygon и т.п.) */
  chainId: number;
  /** адрес получателя средств */
  address: string;
  /** опционально можно оставить валюту */
  currency?: string;
}

/**
 * Профиль пользователя в приложении.
 * avatar может быть либо строкой-URL, либо объектом NFTAvatar.
 */
export interface Profile {
  handle: string;
  bio?: string;
  email?: string;
  avatar: string | NFTAvatar;
  links: SocialLink[];
  donationAddrs: DonationAddress[];
  avatarCid: string;
  privateDataCID: string;
  reputation: bigint;
}