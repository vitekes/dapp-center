'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, rows = 4, ...rest }, ref) {
    return (
      <label className="block space-y-1">
        {label && <span className="text-sm">{label}</span>}

        <textarea
          ref={ref}
          rows={rows}
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

Textarea.displayName = 'Textarea';