import * as Label from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '../lib/cn';

export const Form = React.memo(
  React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
    ({ className, noValidate = true, ...props }, ref) => (
      <form ref={ref} className={cn('space-y-4', className)} noValidate={noValidate} {...props} />
    )
  )
);
Form.displayName = 'Form';

export type FormFieldProps = React.HTMLAttributes<HTMLDivElement>;

export const FormField = React.memo(
  React.forwardRef<HTMLDivElement, FormFieldProps>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('grid gap-2', className)} {...props} />
  ))
);
FormField.displayName = 'FormField';

export type FormLabelProps = React.ComponentPropsWithoutRef<typeof Label.Root>;

export const FormLabel = React.memo(
  React.forwardRef<React.ElementRef<typeof Label.Root>, FormLabelProps>(
    ({ className, ...props }, ref) => (
      <Label.Root
        ref={ref}
        className={cn('text-sm font-medium leading-none text-foreground', className)}
        {...props}
      />
    )
  )
);
FormLabel.displayName = 'FormLabel';

export type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>;

export const FormControl = React.memo(
  React.forwardRef<React.ElementRef<typeof Slot>, FormControlProps>(({ ...props }, ref) => (
    <Slot ref={ref} {...props} />
  ))
);
FormControl.displayName = 'FormControl';

export type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** When true, message is treated as an error for assistive tech */
  error?: boolean;
};

export const FormMessage = React.memo(
  React.forwardRef<HTMLParagraphElement, FormMessageProps>(
    ({ className, error, id, ...props }, ref) => (
      <p
        ref={ref}
        id={id}
        role={error ? 'alert' : undefined}
        className={cn('text-sm', error ? 'text-red-600' : 'text-foreground-muted', className)}
        {...props}
      />
    )
  )
);
FormMessage.displayName = 'FormMessage';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.memo(
  React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
        'placeholder:text-foreground-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  ))
);
Input.displayName = 'Input';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[96px] w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
        'placeholder:text-foreground-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  ))
);
Textarea.displayName = 'Textarea';
