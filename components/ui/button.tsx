import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'icon' | 'sm' | 'md' | 'lg';
  className?: string;
};

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  // Size mappings
  const sizeStyles: Record<string, string> = {
    icon: 'p-0',
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Base styling
  const baseStyles = `rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent ${sizeStyles[size]}`;

  // Variant styling
  let variantStyles = '';
  switch (variant) {
    case 'outline':
      variantStyles = 'border border-text-secondary text-text-secondary bg-transparent';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-text-secondary hover:bg-surface-primary';
      break;
    case 'destructive':
      variantStyles = 'bg-red-600 text-text-primary hover:bg-red-700';
      break;
    case 'secondary':
      variantStyles = 'bg-surface-secondary text-text-primary hover:bg-surface-primary';
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
```
