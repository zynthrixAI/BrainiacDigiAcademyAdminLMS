import { Icon, type IconProps } from './Icon';

export function UploadIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
    />
  );
}
