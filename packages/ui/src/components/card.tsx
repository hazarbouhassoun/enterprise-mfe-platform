import * as React from 'react';
import { cn } from '../lib/cn';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        'rounded-lg border border-foreground/10 bg-surface text-foreground shadow-card',
        className
      )}
      {...props}
    />
  ))
);
Card.displayName = 'Card';

export const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('flex flex-col gap-1 p-6 pb-3', className)} {...props} />
    )
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.memo(
  React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3 ref={ref} className={cn('text-lg font-semibold leading-none', className)} {...props} />
    )
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.memo(
  React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
      <p ref={ref} className={cn('text-sm text-foreground-muted', className)} {...props} />
    )
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    )
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
    )
  )
);
CardFooter.displayName = 'CardFooter';
