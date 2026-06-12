import { Icon, type IconProps } from './Icon';

export function LogoutIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon {...props} d="M15 17l5-5-5-5M20 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  );
}
