'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AdminShellProps {
  children: ReactNode;
}

/** App chrome for the admin portal: sidebar + top bar around the page content. */
export function AdminShell({ children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[252px_1fr]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-col">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="w-full max-w-[1480px] px-4 pb-24 pt-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
