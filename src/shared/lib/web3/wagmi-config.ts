import { http } from 'wagmi';
import {
  getDefaultConfig,
  type Chain as RainbowKitChain,
} from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';

/* ---------------------------------------------------------- */
/* 1. Сети                                                    */
/* ---------------------------------------------------------- */
export const hardhat = defineChain({
  id: 31337,
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public:  { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Hardhat', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
}) as RainbowKitChain;

/* ————————————————————————————————————————————————————————
   Выбор сети по переменной окружения
———————————————————————————————————————————————————————— */
const currentId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 31337;

const registry: Record<number, RainbowKitChain> = {
  31337: hardhat,
  11155111: sepolia,
  1: mainnet,
};

export const CHAINS = [registry[currentId]] as const satisfies readonly [
  RainbowKitChain,
  ...RainbowKitChain[]
];

/* ---------------------------------------------------------- */
/* 2. Транспорты                                              */
/* ---------------------------------------------------------- */
const transports = {
  [hardhat.id]: http('http://127.0.0.1:8545'),
  [sepolia.id]: http(), // можно заменить на свой URL
  [mainnet.id]: http(),
};

/* ---------------------------------------------------------- */
/* 3. Итоговый Wagmi-/RainbowKit-config                       */
/* ---------------------------------------------------------- */
export const wagmiConfig = getDefaultConfig({
  appName: 'DApp Center',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '<walletconnect-id>',
  chains: CHAINS,
  transports,
  ssr: true,
});