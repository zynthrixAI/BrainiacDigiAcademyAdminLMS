import { Icon, type IconProps } from './Icon';

export function SendIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d={
        <>
          <path d="M22 2 11 13" />
          <path d="M22 2 15 22 11 13 2 9 22 2Z" />
        </>
      }
    />
  );
}
