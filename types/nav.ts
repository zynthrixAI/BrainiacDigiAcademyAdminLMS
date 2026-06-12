import type { ComponentType } from 'react';

/** Any icon component that accepts a size + className. */
export type IconComponent = ComponentType<{ size?: number; className?: string }>;

export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon: IconComponent;
  /** Only shown to superadmins (e.g. admin-account management). */
  superadminOnly?: boolean;
}

export interface NavSection {
  section: string;
}

export type NavEntry = NavSection | NavLink;
