import * as React from 'react';
import { cn, getStatusColor } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: string;
}

function Badge({ className, status, children, ...props }: BadgeProps) {
  const statusClass = status ? getStatusColor(status) : '';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        statusClass,
        className
      )}
      {...props}
    >
      {children || status}
    </div>
  );
}

export { Badge };
