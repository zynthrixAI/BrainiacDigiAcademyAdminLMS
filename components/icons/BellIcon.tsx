import { Icon, type IconProps } from './Icon';

export function BellIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon {...props} d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 0 0 4 0" />
  );
}
