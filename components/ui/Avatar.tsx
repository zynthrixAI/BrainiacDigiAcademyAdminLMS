interface AvatarProps {
  initials: string;
  /** Optional image URL; falls back to initials when absent. */
  src?: string | null;
  size?: number;
  /** Tailwind classes for background + text colour (initials only). */
  className?: string;
}

/** Circular avatar — image when provided, otherwise initials. Presentational atom. */
export function Avatar({
  initials,
  src,
  size = 36,
  className = 'bg-yellow text-ink',
}: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={initials}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-extrabold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}
