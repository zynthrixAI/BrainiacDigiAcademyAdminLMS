import { Icon, type IconProps } from './Icon';

export function LayersIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="m3 13 9 5 9-5" />
        </>
      }
    />
  );
}
