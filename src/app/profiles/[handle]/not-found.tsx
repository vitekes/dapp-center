// src/app/profiles/[handle]/not-found.tsx
import Link from 'next/link';

export default function ProfileNotFound() {
  return (
    <main className="container mx-auto max-w-2xl py-20 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Профиль не найден</h1>
      <p className="text-gray-500">Проверьте корректность handle.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        На главную
      </Link>
    </main>
  );
}