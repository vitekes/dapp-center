'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Подпись над полем */
    label?: string;
    /** Текст ошибки */
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    function Input(
        {className, type = 'text', label, error, ...rest},
        ref,
    ) {
        return (
            <label className="block space-y-1">
                {label && <span className="text-sm">{label}</span>}

                <input
                    ref={ref}
                    type={type}
                    className={clsx(
                        'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                        className,
                    )}
                    {...rest}
                />

                {error && <span className="text-xs text-red-500">{error}</span>}
            </label>
        );
    },
);

Input.displayName = 'Input';