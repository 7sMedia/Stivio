import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`bg-surface-primary text-text-primary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      {...props}
    />
  );
}
