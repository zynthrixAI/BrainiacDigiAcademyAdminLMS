import { Icon, type IconProps } from './Icon';

export function RobinIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 13c.8 1.2 2.2 2 4 2s3.2-.8 4-2" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M12 3v3" />
        </>
      }
    />
  );
}
