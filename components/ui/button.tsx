import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md shadow-sm bg-accent text-bg-dark hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
