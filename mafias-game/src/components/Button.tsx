import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brass text-ink-950 hover:bg-brass-bright active:bg-brass-dim shadow-[0_10px_30px_-10px_rgba(201,162,75,0.5)]',
  secondary:
    'bg-ink-800 text-parchment border border-ink-600 hover:bg-ink-700 active:bg-ink-850',
  danger:
    'bg-blood text-parchment hover:bg-blood-bright active:bg-blood shadow-[0_10px_30px_-10px_rgba(178,58,72,0.5)]',
  ghost:
    'bg-transparent text-ash hover:text-parchment hover:bg-ink-800',
};

export default function Button({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        'font-body font-semibold text-base rounded-xl px-6 py-4',
        'transition-all duration-150 active:scale-[0.98]',
        'disabled:opacity-40 disabled:pointer-events-none',
        fullWidth ? 'w-full' : '',
        variantClasses[variant],
        className,
      ].join(' ')}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
