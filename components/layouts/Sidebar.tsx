'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ADMIN_NAV, isNavSection } from '@/lib/admin-nav';
import { useProfile } from '@/hooks/query/useProfile';
import { logout } from '@/lib/api/auth';
import { getRefreshToken, clearSession } from '@/lib/auth-session';
import { initialsOf } from '@/lib/utils/format';
import { BdaLogo } from '@/components/icons/BdaLogo';
import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { Avatar } from '@/components/ui/Avatar';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  const isSuperadmin = profile?.role === 'superadmin';
  const adminName = profile?.name ?? 'Admin';
  const roleLabel = isSuperadmin ? 'Super Admin' : 'Admin';

  const signOut = async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) await logout(refreshToken);
    } catch {
      // Revoke best-effort — clear locally regardless of the server result.
    }
    await clearSession();
    queryClient.clear();
    router.push('/login');
  };

  return (
    <aside
      className={`no-scrollbar fixed left-0 top-0 z-50 flex h-dvh w-[252px] flex-col gap-2 overflow-y-auto overscroll-contain bg-[#0f0e0e] px-3.5 py-6 text-[#f5f5f4] transition-transform duration-200 lg:sticky lg:z-auto lg:h-dvh lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.3)]' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-3 px-2 pb-3.5 pt-1">
        <BdaLogo size={38} />
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-extrabold tracking-[0.02em] text-white">
            BDA Admin
          </span>
          <span className="mt-1 text-[9.5px] uppercase tracking-[0.1em] text-sidebar-muted">
            Brainiacs Digital
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {ADMIN_NAV.map((entry, i) => {
          if (isNavSection(entry)) {
            return (
              <div
                key={`section-${i}`}
                className="px-3 pb-1 pt-3 text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-[#5b5955]"
              >
                {entry.section}
              </div>
            );
          }
          // Hide superadmin-only links (e.g. Admins) from plain admins.
          if (entry.superadminOnly && !isSuperadmin) return null;
          const Icon = entry.icon;
          const active = pathname.startsWith(entry.href);
          return (
            <Link
              key={entry.id}
              href={entry.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-display text-[13px] transition-colors ${
                active
                  ? 'bg-yellow font-bold text-ink'
                  : 'font-medium text-[#dcdad4] hover:bg-white/[0.06]'
              }`}
            >
              <Icon size={16} />
              <span>{entry.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Avatar
            initials={profile ? initialsOf(adminName) : '—'}
            size={30}
            className="bg-yellow/20 text-yellow"
          />
          <div className="flex min-w-0 flex-1 flex-col leading-[1.15]">
            <span className="truncate text-[12.5px] font-bold text-white">{adminName}</span>
            <span className="text-[10.5px] text-sidebar-muted">{roleLabel}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 font-display text-[12.5px] font-semibold text-[#bdbab2] transition-colors hover:bg-white/[0.06]"
        >
          <LogoutIcon size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
