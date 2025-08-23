/**
 * 📝 Input Component - Catalyst UI adaptado para MIC MAC Pro
 * Campos de entrada premium con diseño oscuro
 */

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

export function InputGroup({ children }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="control"
      className={clsx(
        'relative isolate block',
        'has-[[data-slot=icon]:first-child]:[&_input]:pl-10 has-[[data-slot=icon]:last-child]:[&_input]:pr-10 sm:has-[[data-slot=icon]:first-child]:[&_input]:pl-8 sm:has-[[data-slot=icon]:last-child]:[&_input]:pr-8',
        '*:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:absolute *:data-[slot=icon]:top-3 *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:top-2.5 sm:*:data-[slot=icon]:size-4',
        '[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5',
        '*:data-[slot=icon]:text-dark-text-muted'
      )}
    >
      {children}
    </span>
  )
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week']
type DateType = (typeof dateTypes)[number]

export const Input = forwardRef<
  HTMLInputElement,
  {
    className?: string
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType
  } & Omit<Headless.InputProps, 'as' | 'className'>
>(function Input({ className, ...props }, ref) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        'relative block w-full',
        // Background with subtle gradient
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-xl)-1px)] before:bg-gradient-to-b before:from-dark-bg-tertiary before:to-dark-bg-secondary before:shadow-sm',
        // Focus ring
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:ring-transparent after:ring-inset focus-within:after:ring-2 focus-within:after:ring-micmac-primary-500',
        // Disabled state
        'has-[:disabled]:opacity-50 has-[:disabled]:before:bg-dark-bg-tertiary/50 has-[:disabled]:before:shadow-none',
      ])}
    >
      <Headless.Input
        ref={ref}
        {...props}
        className={clsx([
          // Date classes
          props.type &&
            dateTypes.includes(props.type) && [
              '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
              '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
              '[&::-webkit-datetime-edit]:inline-flex',
              '[&::-webkit-datetime-edit]:p-0',
              '[&::-webkit-datetime-edit-year-field]:p-0',
              '[&::-webkit-datetime-edit-month-field]:p-0',
              '[&::-webkit-datetime-edit-day-field]:p-0',
              '[&::-webkit-datetime-edit-hour-field]:p-0',
              '[&::-webkit-datetime-edit-minute-field]:p-0',
              '[&::-webkit-datetime-edit-second-field]:p-0',
              '[&::-webkit-datetime-edit-millisecond-field]:p-0',
              '[&::-webkit-datetime-edit-meridiem-field]:p-0',
            ],
          // Basic layout
          'relative block w-full appearance-none rounded-xl px-4 py-3 sm:px-3 sm:py-2',
          // Typography
          'text-base/6 text-dark-text-primary placeholder:text-dark-text-muted sm:text-sm/6',
          // Border
          'border border-dark-bg-tertiary hover:border-micmac-primary-500/50 focus:border-micmac-primary-500',
          // Background color
          'bg-transparent',
          // Hide default focus styles
          'focus:outline-none',
          // Invalid state
          'invalid:border-red-500 invalid:hover:border-red-500',
          // Disabled state
          'disabled:border-dark-bg-tertiary/50 disabled:bg-dark-bg-tertiary/25 disabled:cursor-not-allowed',
          // Transitions
          'transition-colors duration-200',
        ])}
      />
    </span>
  )
})

export function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'label'>) {
  return (
    <label
      {...props}
      className={clsx(
        className,
        'block text-sm font-medium text-dark-text-secondary mb-2'
      )}
    />
  )
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className, 'space-y-2')}
    />
  )
}

export function ErrorMessage({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      {...props}
      className={clsx(
        className,
        'text-sm text-red-400 mt-1'
      )}
    >
      {children}
    </p>
  )
}

export function HelpText({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      {...props}
      className={clsx(
        className,
        'text-sm text-dark-text-muted mt-1'
      )}
    >
      {children}
    </p>
  )
}
