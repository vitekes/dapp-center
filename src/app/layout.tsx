'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/shared/lib/web3/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {/* Глобальные провайдеры Wagmi / RainbowKit / React-Query */}
        <Providers>
          {children}
        </Providers>

        {/* Глобальные тосты */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}