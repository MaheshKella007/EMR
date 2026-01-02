import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white p-2 rounded-lg shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  );
};