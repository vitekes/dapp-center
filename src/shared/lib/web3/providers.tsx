'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { wagmiConfig } from './wagmi-config'; // CHAINS пока могут понадобиться другим модулям

const queryClient = new QueryClient();

/**
 * Глобальные провайдеры Wagmi / RainbowKit / React-Query.
 */
export function Providers({children}: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme({accentColor: '#3b82f6'})}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}