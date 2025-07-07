import React, { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface-primary p-6 rounded-md shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// Optional content wrapper for card sections
export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
