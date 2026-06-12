'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DownIcon } from '@/components/icons/DownIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Show a search box inside the dropdown that filters options by label. */
  searchable?: boolean;
  id?: string;
}

interface PanelRect {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
}

/** Custom dropdown — a portal-positioned listbox (escapes modal overflow),
 *  with an optional search box. Replaces the native <select> chrome. */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  searchable = false,
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [rect, setRect] = useState<PanelRect | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;
  const filtered =
    searchable && query
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const down = spaceBelow >= 220 || spaceBelow >= spaceAbove;
    setRect({
      left: r.left,
      width: r.width,
      top: down ? r.bottom + 6 : undefined,
      bottom: down ? undefined : window.innerHeight - r.top + 6,
      maxHeight: Math.min(280, (down ? spaceBelow : spaceAbove) - 14),
    });
  };

  const openPanel = () => {
    if (disabled) return;
    place();
    setQuery('');
    setActiveIndex(0);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const reposition = () => place();
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    if (!searchable) panelRef.current?.focus();
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open, searchable]);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onPanelKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const o = filtered[activeIndex];
      if (o) choose(o.value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="font-display text-[12.5px] font-bold text-ink-2">
          {label}
        </label>
      )}
      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPanel())}
        className={`flex items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm outline-none transition-colors ${
          open ? 'border-yellow' : 'border-line'
        } ${disabled ? 'cursor-default bg-[#faf9f7] text-ink' : 'text-ink hover:border-line-2'}`}
      >
        <span className={`truncate ${selected ? 'text-ink' : 'text-muted-2'}`}>
          {selected ? selected.label : placeholder}
        </span>
        {!disabled && (
          <DownIcon
            size={14}
            className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            tabIndex={-1}
            onKeyDown={onPanelKey}
            style={{
              position: 'fixed',
              left: rect.left,
              width: rect.width,
              top: rect.top,
              bottom: rect.bottom,
            }}
            className="animate-dialog-in z-[200] overflow-hidden rounded-xl border border-line bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)] outline-none"
          >
            {searchable && (
              <div className="border-b border-line p-2">
                <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-1.5 text-muted focus-within:border-yellow">
                  <SearchIcon size={14} />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    placeholder="Search…"
                    className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
                  />
                </label>
              </div>
            )}
            <ul role="listbox" className="no-scrollbar overflow-y-auto py-1" style={{ maxHeight: rect.maxHeight }}>
              {filtered.length === 0 ? (
                <li className="px-3 py-3 text-[13px] text-muted">No matches.</li>
              ) : (
                filtered.map((o, i) => {
                  const isSelected = o.value === value;
                  return (
                    <li key={o.value || `opt-${i}`}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => choose(o.value)}
                        className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                          i === activeIndex ? 'bg-[#faf9f7]' : ''
                        } ${isSelected ? 'font-semibold text-ink' : 'text-ink'}`}
                      >
                        <span className="flex min-w-0 flex-col leading-tight">
                          <span className="truncate">{o.label}</span>
                          {o.description && (
                            <span className="truncate text-[11.5px] font-normal text-muted">
                              {o.description}
                            </span>
                          )}
                        </span>
                        {isSelected && <CheckIcon size={14} className="shrink-0 text-[var(--green)]" />}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
