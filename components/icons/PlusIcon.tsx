import { Icon, type IconProps } from './Icon';

export function PlusIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="M12 5v14M5 12h14" />;
}
