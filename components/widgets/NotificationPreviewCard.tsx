import { Card } from '@/components/ui/Card';
import { BellIcon } from '@/components/icons/BellIcon';

interface NotificationPreviewCardProps {
  title: string;
  body: string;
}

/** Live preview of how the notification appears in the student app. */
export function NotificationPreviewCard({ title, body }: NotificationPreviewCardProps) {
  return (
    <Card>
      <h3 className="font-display text-[14px] font-bold text-ink">Preview</h3>
      <span className="text-[12.5px] text-muted">How it shows up in the student app</span>

      <div className="mt-4 rounded-xl border border-dashed border-line-2 bg-[#fafaf9] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-yellow-soft text-[var(--yellow-ink)]">
            <BellIcon size={16} />
          </span>
          <div className="flex flex-col leading-[1.45]">
            <span className="font-display text-[13.5px] font-bold text-ink">
              {title || 'Your notification title'}
            </span>
            <span className="mt-1 text-[12.5px] text-muted">
              {body || 'Your message body will appear here…'}
            </span>
            <span className="mt-2.5 text-[10.5px] text-muted">Just now · BDA</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
