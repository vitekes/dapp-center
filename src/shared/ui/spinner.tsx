'use client';

import React from 'react';
import clsx from 'clsx';

interface SpinnerProps {
    /** Дополнительные CSS-классы */
    className?: string;
    /** Диаметр иконки в px (по умолчанию 24) */
    size?: number;
    /** Цвет, если нужен отличный от текущего `currentColor` */
    color?: string;
}

/**
 * SVG-спиннер с анимацией `animate-spin`.
 * Использует Tailwind-классы и не требует сторонних зависимостей.
 */
export function Spinner({className, size = 24, color}: SpinnerProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={clsx('animate-spin', className)}
            style={{color}}
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}