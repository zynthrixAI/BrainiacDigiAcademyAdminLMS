import { Icon, type IconProps } from './Icon';

export function UserIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
        </>
      }
    />
  );
}
