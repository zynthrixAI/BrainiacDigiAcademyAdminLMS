import type { NavEntry, NavLink, NavSection } from '@/types/nav';
import { DashboardIcon } from '@/components/icons/DashboardIcon';
import { TrophyIcon } from '@/components/icons/TrophyIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { PinIcon } from '@/components/icons/PinIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { LayersIcon } from '@/components/icons/LayersIcon';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { CardIcon } from '@/components/icons/CardIcon';
import { BellIcon } from '@/components/icons/BellIcon';
import { RobinIcon } from '@/components/icons/RobinIcon';
import { SettingsIcon } from '@/components/icons/SettingsIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';

/** Sidebar navigation model for the admin portal. */
export const ADMIN_NAV: NavEntry[] = [
  { section: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: TrophyIcon },

  { section: 'People' },
  { id: 'students', label: 'Students', href: '/students', icon: UserIcon },
  { id: 'teachers', label: 'Teachers', href: '/teachers', icon: UserIcon },
  { id: 'leads', label: 'Leads / CRM', href: '/leads', icon: PinIcon },
  { id: 'admins', label: 'Admins', href: '/admins', icon: ShieldIcon, superadminOnly: true },

  { section: 'Content' },
  { id: 'subjects', label: 'Subjects', href: '/subjects', icon: LayersIcon },
  { id: 'courses', label: 'Courses', href: '/courses', icon: BookIcon },
  { id: 'batches', label: 'Batches', href: '/batches', icon: UsersIcon },

  { section: 'Operations' },
  { id: 'subscriptions', label: 'Subscriptions', href: '/subscriptions', icon: CardIcon },
  { id: 'payouts', label: 'Payouts', href: '/payouts', icon: CardIcon },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: BellIcon },
  { id: 'robin-log', label: 'Robin queries', href: '/robin-log', icon: RobinIcon },
  { id: 'settings', label: 'Settings', href: '/settings', icon: SettingsIcon },
];

export const isNavSection = (entry: NavEntry): entry is NavSection =>
  'section' in entry;

const isNavLink = (entry: NavEntry): entry is NavLink => 'href' in entry;

/** Resolve the page title for a given pathname from the nav model. */
export const getNavTitle = (pathname: string): string => {
  const match = ADMIN_NAV.filter(isNavLink).find((link) =>
    pathname.startsWith(link.href),
  );
  return match?.label ?? 'Dashboard';
};
