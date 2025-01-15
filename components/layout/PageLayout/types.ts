import { ReactNode } from 'react';
import { RouteGroup } from '@/lib/routes/types';

export interface FooterConfig {
  show?: boolean;
  sticky?: boolean;
  content?: ReactNode;
}

export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  toolbar?: ReactNode;
  layout?: RouteGroup;
  footer?: FooterConfig;
  className?: string;
}

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  toolbar?: ReactNode;
}

export interface PageFooterProps {
  children?: ReactNode;
  sticky?: boolean;
  className?: string;
} 