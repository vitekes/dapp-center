import '@/app/globals.css';            // ← глобальные стили (Tailwind, reset и т.д.)
import React from 'react';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/shared/lib/web3/providers';

export const metadata: Metadata = {
  title:  'DApp Center',
  description: 'Децентрализованный центр приложений',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </Providers>
      </body>
    </html>
  );
}