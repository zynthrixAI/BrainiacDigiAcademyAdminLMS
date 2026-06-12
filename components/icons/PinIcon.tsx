import { Icon, type IconProps } from './Icon';

export function PinIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="M12 17v5M9 3h6M10 3v8a4 4 0 0 1-3 4h10a4 4 0 0 1-3-4V3" />;
}
