import { Icon, type IconProps } from './Icon';

export function ShieldIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="M12 3l8 3v6c0 4.5-3.4 7.6-8 9-4.6-1.4-8-4.5-8-9V6l8-3z" />;
}
