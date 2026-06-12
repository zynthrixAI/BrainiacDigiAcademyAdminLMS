import { Icon, type IconProps } from './Icon';

export function ArrowIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="M5 12h14M13 5l7 7-7 7" />;
}
