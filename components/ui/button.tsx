import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
};

export function Button({
  children,
  variant = 'default',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent';

  let variantStyles = '';
  switch (variant) {
    case 'outline':
      variantStyles = 'border border-text-secondary text-text-secondary bg-transparent';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-text-secondary hover:bg-surface-primary';
      break;
    default:
      variantStyles = 'bg-accent text-bg-dark';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
