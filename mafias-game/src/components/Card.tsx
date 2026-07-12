import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={[
        'bg-ink-850 border border-ink-700 rounded-2xl p-5 stamp-shadow',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
