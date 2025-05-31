import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** размер кнопки */
    size?: 'sm' | 'md' | 'lg';
    /** визуальный вариант */
    variant?: 'primary' | 'secondary' | 'ghost';
    /**
     * Если true — отрисовываем не `<button>`, а `<Slot>`, позволяя
     * «прокинуть» стили на дочерний элемент.
     */
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            size = 'md',
            variant = 'primary',
            asChild = false,
            className,
            children,
            ...rest
        },
        ref,
    ) => {
        const Comp: React.ElementType = asChild ? Slot : 'button';

        return (
            <Comp
                ref={ref}
                className={clsx(
                    // базовые стили
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50',
                    // размеры
                    size === 'sm' && 'h-8 px-3 text-sm',
                    size === 'md' && 'h-10 px-4',
                    size === 'lg' && 'h-12 px-6 text-lg',
                    // варианты
                    variant === 'primary' &&
                    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
                    variant === 'secondary' &&
                    'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
                    variant === 'ghost' &&              // ← стили для ghost
                    'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
                    className,
                )}
                {...rest}
            >
                {children}
            </Comp>
        );
    },
);

Button.displayName = 'Button';