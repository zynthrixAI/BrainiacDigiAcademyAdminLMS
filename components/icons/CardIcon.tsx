import { Icon, type IconProps } from './Icon';

export function CardIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 11h18" />
        </>
      }
    />
  );
}
