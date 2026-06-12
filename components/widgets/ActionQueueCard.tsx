import Link from 'next/link';
import type { ActionQueueItem } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

interface ActionQueueCardProps {
  items: ActionQueueItem[];
}

export function ActionQueueCard({ items }: ActionQueueCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[15px] font-bold text-ink">Action queue</h3>
        <Pill className="bg-[#fef3c7] text-[#92400e]">{items.length} items</Pill>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`grid grid-cols-[1fr_auto] items-center gap-2.5 rounded-[10px] border bg-[#faf9f7] px-3 py-2.5 transition-colors hover:bg-[#f5f3ef] ${
              item.urgent ? 'border-[rgba(226,59,59,0.2)]' : 'border-line'
            }`}
          >
            <span className="flex min-w-0 flex-col leading-[1.3]">
              <span className="font-display text-[13px] font-bold text-ink">
                {item.title}
              </span>
              <span className="text-[13px] text-muted">{item.description}</span>
            </span>
            <span className="whitespace-nowrap text-[11.5px] font-bold text-yellow-ink">
              {item.action} →
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
