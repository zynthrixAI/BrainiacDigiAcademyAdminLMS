'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavTitle } from '@/lib/admin-nav';
import { GlobeIcon } from '@/components/icons/GlobeIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { DashboardIcon } from '@/components/icons/DashboardIcon';

interface TopBarProps {
  onMenu: () => void;
}

export function TopBar({ onMenu }: TopBarProps) {
  const pathname = usePathname();
  const title = getNavTitle(pathname);

  return (
    <div className="flex items-center justify-between gap-6 px-4 pt-4 sm:px-8 sm:pt-[22px]">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-ink lg:hidden"
        >
          <DashboardIcon size={15} />
        </button>
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            Admin
          </span>
          <h2 className="font-display text-[22px] font-extrabold leading-[1.1] text-ink">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="#"
          className="hidden items-center gap-2 rounded-xl border border-line-2 px-3 py-2 font-display text-xs font-bold text-ink transition-colors hover:bg-[#fafaf9] md:inline-flex"
        >
          <GlobeIcon size={13} /> Teacher portal
        </Link>
        <Link
          href="#"
          className="hidden items-center gap-2 rounded-xl border border-line-2 px-3 py-2 font-display text-xs font-bold text-ink transition-colors hover:bg-[#fafaf9] md:inline-flex"
        >
          <UserIcon size={13} /> Student portal
        </Link>
      </div>
    </div>
  );
}
