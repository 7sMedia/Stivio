import React, { ReactNode } from 'react';

type CardProps = {
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
