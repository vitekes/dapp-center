'use client';

import clsx from 'clsx';

interface SkeletonProps {
    /** Дополнительные CSS-классы */
    className?: string;
    /** Сколько одинаковых «полосок» отрисовать подряд. По умолчанию 1 */
    count?: number;
    /** Радиус скругления (Tailwind), по умолчанию rounded-md */
    rounded?: string;
}

/**
 * Универсальный плейсхолдер-скелетон.
 *
 * Пример использования:
 * ```tsx
 * <Skeleton className="h-8 w-32" />            // одиночная полоска
 * <Skeleton count={3} className="h-4 mb-2" />  // три полоски
 * ```
 */
export function Skeleton({
                             className,
                             count = 1,
                             rounded = 'rounded-md',
                         }: SkeletonProps) {
    const stripes = Array.from({length: count});

    return (
        <>
            {stripes.map((_, i) => (
                <div
                    key={i}
                    className={clsx(
                        'animate-pulse bg-gray-200 dark:bg-gray-700',
                        rounded,
                        className,
                    )}
                />
            ))}
        </>
    );
}