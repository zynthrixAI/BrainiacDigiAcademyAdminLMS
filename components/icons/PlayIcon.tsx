import { Icon, type IconProps } from './Icon';

export function PlayIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <circle cx="12" cy="12" r="9" />
          <polygon points="10,8 16,12 10,16" fill="currentColor" />
        </>
      }
    />
  );
}
