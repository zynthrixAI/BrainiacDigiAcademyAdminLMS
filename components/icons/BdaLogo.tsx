interface BdaLogoProps {
  size?: number;
}

/** The square "B" brand mark used on the admin brand panel. */
export function BdaLogo({ size = 44 }: BdaLogoProps) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-xl bg-yellow font-display font-extrabold text-ink"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        boxShadow: '0 6px 18px rgba(249,195,35,0.4)',
      }}
    >
      B
    </div>
  );
}
