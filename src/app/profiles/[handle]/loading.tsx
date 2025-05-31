// src/app/profiles/[handle]/loading.tsx
export default function ProfileLoading() {
  return (
    <main className="container mx-auto max-w-2xl py-8 px-4 space-y-4">
      <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-6 w-2/3 rounded bg-gray-200 animate-pulse" />
      <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
    </main>
  );
}