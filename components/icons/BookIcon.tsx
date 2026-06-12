import { Icon, type IconProps } from './Icon';

export function BookIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"
    />
  );
}
