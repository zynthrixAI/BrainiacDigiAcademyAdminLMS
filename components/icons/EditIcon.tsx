import { Icon, type IconProps } from './Icon';

export function EditIcon(props: Omit<IconProps, 'd'>) {
  return <Icon {...props} d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />;
}
