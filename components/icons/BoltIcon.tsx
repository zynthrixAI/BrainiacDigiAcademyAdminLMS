import { Icon, type IconProps } from './Icon';

export function BoltIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="m13 2-9 13h7l-1 7 9-13h-7l1-7z" />;
}
