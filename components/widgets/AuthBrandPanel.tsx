import { BdaLogo } from '@/components/icons/BdaLogo';
import { LockIcon } from '@/components/icons/LockIcon';
import { Pill } from '@/components/ui/Pill';

interface BrandStat {
  value: string;
  label: string;
}

const STATS: BrandStat[] = [
  { value: 'Rs. 515k', label: 'MRR' },
  { value: '342', label: 'Active students' },
  { value: '12', label: 'Teachers' },
];

/**
 * Left-hand marketing panel of the admin login. Static, presentational
 * feature block — no data hooks.
 */
export function AuthBrandPanel() {
  return (
    <div
      className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col"
      style={{ background: 'linear-gradient(160deg, #1c1b1b 0%, #2a2926 100%)' }}
    >
      <div
        className="pointer-events-none absolute -right-40 -top-30 h-[460px] w-[460px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(249,195,35,0.22) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex h-full max-w-[520px] flex-col justify-between">
        <div className="flex items-center gap-3">
          <BdaLogo />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold">BDA Admin</span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.08em] text-sidebar-muted">
              Operations console
            </span>
          </div>
        </div>

        <div className="mt-[6vh]">
          <Pill className="bg-yellow/15 text-yellow">
            <LockIcon size={11} /> Restricted access
          </Pill>
          <h1 className="my-4 mt-5 font-display text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
            Run the school. <span className="text-yellow">One console.</span>
          </h1>
          <p className="m-0 max-w-[460px] text-[14.5px] leading-[1.65] text-white/65">
            Approve subjects, schedule teacher payouts, run leads through the
            pipeline, and broadcast updates to every student — without leaving
            this dashboard.
          </p>

          <div className="mt-9 grid grid-cols-3 justify-start gap-9">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-[22px] font-extrabold text-yellow">
                  {stat.value}
                </div>
                <div className="text-xs text-white/55">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <span className="mt-7 text-xs text-white/45">© 2026 BDA · Karachi, PK</span>
      </div>
    </div>
  );
}
