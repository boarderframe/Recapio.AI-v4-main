import React from 'react';
import Link from 'next/link';
import { cn } from '@/app/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export default function Logo({ 
  className, 
  variant = 'default',
  size = 'md',
  href = '/'
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const variantClasses = {
    default: 'text-primary-600',
    white: 'text-white'
  };

  return (
    <Link 
      href={href}
      className={cn(
        'font-bold transition-colors duration-200 no-underline',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="whitespace-nowrap">Recapio.AI</span>
    </Link>
  );
} 