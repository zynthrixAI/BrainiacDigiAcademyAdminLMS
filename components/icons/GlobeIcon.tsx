import { Icon, type IconProps } from './Icon';

export function GlobeIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
      }
    />
  );
}
