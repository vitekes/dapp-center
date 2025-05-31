// src/app/page.tsx
'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

/**
 * Главная страница “/”.
 * Показывает краткое описание проекта и пару CTA-кнопок.
 */
export default function HomePage() {
  return (
    <main className="flex flex-col items-center gap-16 py-20 px-4">
      {/* ---------------- рынка Hero-блок --------------------------- */}
      <section className="flex max-w-3xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          DApp&nbsp;Center
        </h1>

        <p className="text-lg text-gray-600">
          Площадка, где разработчики и пользователи децентрализованных
          приложений находят друг друга. Создавайте визитку, собирайте бейджи и
          зарабатывайте репутацию в экосистеме Web&nbsp;3.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/profile/create"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Создать профиль
          </Link>

          <Link
            href="/profiles"
            className="rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Посмотреть участников
          </Link>
        </div>
      </section>

      {/* ---------------------- Подключение кошелька -------------------- */}
      <section>
        <ConnectButton chainStatus="icon" showBalance={false} />
      </section>
    </main>
  );
}