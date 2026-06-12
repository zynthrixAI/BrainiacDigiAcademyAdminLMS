import { Icon, type IconProps } from './Icon';

export function CheckIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="m5 12 5 5L20 7" />;
}
