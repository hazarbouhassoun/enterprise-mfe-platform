import * as React from 'react';
import { cn } from '../lib/cn';

export type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  /** Shown as <caption> for WCAG table summaries */
  caption?: string;
};

export const Table = React.memo(
  React.forwardRef<HTMLTableElement, TableProps>(({ className, caption, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-md border border-foreground/10">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm text-foreground', className)}
        {...props}
      >
        {caption ? (
          <caption className="mt-2 text-left text-sm text-foreground-muted">{caption}</caption>
        ) : null}
        {props.children}
      </table>
    </div>
  ))
);
Table.displayName = 'Table';

export const TableHeader = React.memo(
  React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
      <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
    )
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.memo(
  React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
      <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
    )
  )
);
TableBody.displayName = 'TableBody';

export const TableFooter = React.memo(
  React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
      <tfoot
        ref={ref}
        className={cn('border-t bg-surface-muted/50 font-medium [&>tr]:last:border-b-0', className)}
        {...props}
      />
    )
  )
);
TableFooter.displayName = 'TableFooter';

export const TableRow = React.memo(
  React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
      <tr
        ref={ref}
        className={cn(
          'border-b border-foreground/10 transition-colors hover:bg-surface-muted/40 data-[state=selected]:bg-surface-muted',
          className
        )}
        {...props}
      />
    )
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.memo(
  React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, scope = 'col', ...props }, ref) => (
      <th
        ref={ref}
        className={cn(
          'h-11 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-foreground-muted',
          className
        )}
        scope={scope}
        {...props}
      />
    )
  )
);
TableHead.displayName = 'TableHead';

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = React.memo(
  React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
    <td ref={ref} className={cn('p-3 align-middle', className)} {...props} />
  ))
);
TableCell.displayName = 'TableCell';
