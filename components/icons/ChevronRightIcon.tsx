import { Icon, type IconProps } from './Icon';

export function ChevronRightIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="m9 18 6-6-6-6" />;
}
