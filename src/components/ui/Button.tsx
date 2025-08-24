/**
 * 🔘 Button Component - Catalyst UI adaptado para MIC MAC Pro
 * Botones premium con soporte para colores del tema
 */

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

const styles = {
  base: [
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-xl border text-base/6 font-semibold',
    'px-4 py-2.5 sm:px-3 sm:py-1.5 sm:text-sm/6',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-micmac-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-200 ease-out',
  ],
  solid: [
    'border-transparent shadow-sm',
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-xl)-1px)]',
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-xl)-1px)]',
    'hover:scale-105 active:scale-95',
  ],
  outline: [
    'border-dark-bg-tertiary text-dark-text-primary',
    'hover:bg-dark-bg-tertiary/50 active:bg-dark-bg-tertiary',
    'hover:border-dark-text-secondary',
  ],
  ghost: [
    'border-transparent text-dark-text-secondary',
    'hover:bg-dark-bg-tertiary/50 active:bg-dark-bg-tertiary',
    'hover:text-dark-text-primary',
  ],
  colors: {
    primary: [
      'text-white bg-gradient-to-r from-micmac-primary-600 to-micmac-primary-700',
      'hover:from-micmac-primary-500 hover:to-micmac-primary-600',
      'active:from-micmac-primary-700 active:to-micmac-primary-800',
      'shadow-lg shadow-micmac-primary-500/25',
    ],
    secondary: [
      'text-white bg-gradient-to-r from-micmac-secondary-600 to-micmac-secondary-700',
      'hover:from-micmac-secondary-500 hover:to-micmac-secondary-600',
      'active:from-micmac-secondary-700 active:to-micmac-secondary-800',
      'shadow-lg shadow-micmac-secondary-500/25',
    ],
    accent: [
      'text-white bg-gradient-to-r from-micmac-accent-600 to-micmac-accent-700',
      'hover:from-micmac-accent-500 hover:to-micmac-accent-600',
      'active:from-micmac-accent-700 active:to-micmac-accent-800',
      'shadow-lg shadow-micmac-accent-500/25',
    ],
    danger: [
      'text-white bg-gradient-to-r from-red-600 to-red-700',
      'hover:from-red-500 hover:to-red-600',
      'active:from-red-700 active:to-red-800',
      'shadow-lg shadow-red-500/25',
    ],
    dark: [
      'text-white bg-gradient-to-r from-dark-bg-secondary to-dark-bg-tertiary',
      'hover:from-dark-bg-tertiary hover:to-gray-600',
      'shadow-lg shadow-dark-bg-tertiary/50',
    ]
  }
}

type ButtonProps = (
  | { color?: keyof typeof styles.colors; outline?: never; ghost?: never }
  | { color?: never; outline: true; ghost?: never }
  | { color?: never; outline?: never; ghost: true }
) & { 
  className?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
} & (
  | Omit<Headless.ButtonProps, 'as' | 'className'>
  | Omit<React.ComponentPropsWithoutRef<'a'>, 'className'>
)

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { color = 'primary', outline, ghost, size = 'md', className, children, ...props },
  ref
) {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base sm:px-3 sm:py-1.5 sm:text-sm',
    lg: 'px-6 py-3 text-lg sm:px-5 sm:py-2.5 sm:text-base'
  }

  let classes = clsx(
    className,
    styles.base,
    sizeStyles[size],
    outline ? styles.outline : ghost ? styles.ghost : [styles.solid, styles.colors[color]]
  )

  return 'href' in props ? (
    <a {...(props as any)} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>{children}</TouchTarget>
    </a>
  ) : (
    <Headless.Button {...(props as any)} className={classes} ref={ref as React.ForwardedRef<HTMLButtonElement>}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  )
})

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  )
}
