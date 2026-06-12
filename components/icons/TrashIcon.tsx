import { Icon, type IconProps } from './Icon';

export function TrashIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"
    />
  );
}
