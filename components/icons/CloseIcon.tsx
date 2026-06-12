import { Icon, type IconProps } from './Icon';

export function CloseIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="M6 6l12 12M18 6 6 18" />;
}
