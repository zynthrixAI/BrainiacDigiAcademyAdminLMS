import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'd' | 'stroke'> {
  size?: number;
  stroke?: number;
  /** Inline SVG path data (string) or child elements. */
  d: string | ReactNode;
}

/**
 * Base inline-SVG primitive. Inherits color via `currentColor`. Mirrors the
 * design system's `Icon` helper. No logic, no data — presentational only.
 */
export function Icon({ d, size = 18, stroke = 2, fill = 'none', ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
  );
}
