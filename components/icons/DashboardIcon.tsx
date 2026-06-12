import { Icon, type IconProps } from './Icon';

export function DashboardIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </>
      }
    />
  );
}
