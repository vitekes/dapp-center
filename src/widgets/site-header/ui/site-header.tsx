'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MyProfileNavButton } from '@/features/profile/MyProfileNavButton';

export function SiteHeader() {
  return (
      <header className="w-full border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between py-4">
          {/* Логотип / название проекта */}
          <Link href="/public" className="text-xl font-bold">
            DApp&nbsp;Center
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
            <Link href="/profiles">Профили</Link>
            <Link href="/badges">Бейджи</Link>

            {/* «Мой профиль» – появляется после подключения кошелька */}
            <MyProfileNavButton />
          </nav>

          {/* RainbowKit: connect/disconnect */}
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </header>
  );
}