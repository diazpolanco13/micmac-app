/**
 * 🪟 Dialog Component - Catalyst UI adaptado para MIC MAC Pro
 * Modales premium con diseño oscuro
 */

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
}

export function Dialog({
  size = 'lg',
  className,
  children,
  ...props
}: { size?: keyof typeof sizes; className?: string; children: React.ReactNode } & Omit<
  Headless.DialogProps,
  'as' | 'className'
>) {
  return (
    <Headless.Dialog {...props}>
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 flex w-screen justify-center overflow-y-auto bg-black/50 px-2 py-2 transition duration-300 focus:outline-0 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in sm:px-6 sm:py-8 lg:px-8 lg:py-16 backdrop-blur-sm"
      />

      <div className="fixed inset-0 w-screen overflow-y-auto pt-20 pb-4">
        <div className="flex min-h-full items-center justify-center px-4">
          <Headless.DialogPanel
            transition
            className={clsx(
              className,
              sizes[size],
              'w-full bg-dark-bg-secondary rounded-2xl shadow-2xl ring-1 ring-dark-bg-tertiary border border-dark-bg-tertiary/50',
              'transition duration-300 will-change-transform data-[closed]:translate-y-12 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:scale-95',
              'max-h-[calc(100vh-7rem)] overflow-hidden'
            )}
          >
            {children}
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  )
}

export function DialogTitle({
  className,
  ...props
}: { className?: string } & Omit<Headless.DialogTitleProps, 'as' | 'className'>) {
  return (
    <Headless.DialogTitle
      {...props}
      className={clsx(className, 'text-xl font-semibold text-dark-text-primary sm:text-lg')}
    />
  )
}

export function DialogDescription({
  className,
  children,
  ...props
}: { className?: string; children: React.ReactNode } & Omit<React.ComponentPropsWithoutRef<'p'>, 'className'>) {
  return (
    <p 
      {...props} 
      className={clsx(className, 'mt-3 text-dark-text-secondary leading-relaxed')} 
    >
      {children}
    </p>
  )
}

export function DialogBody({ 
  className, 
  ...props 
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'mt-6')} />
}

export function DialogActions({ 
  className, 
  ...props 
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row'
      )}
    />
  )
}
