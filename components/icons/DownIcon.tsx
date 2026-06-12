import { Icon, type IconProps } from './Icon';

export function DownIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="M12 5v14M5 12l7 7 7-7" />;
}
