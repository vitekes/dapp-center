'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}
        {/* Глобальные тосты */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}