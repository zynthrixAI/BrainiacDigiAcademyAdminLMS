import { Icon, type IconProps } from './Icon';

export function TrophyIcon(props: Omit<IconProps, 'd'>) {
  return (
    <Icon
      {...props}
      d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM7 7H4v2a3 3 0 0 0 3 3M17 7h3v2a3 3 0 0 1-3 3"
    />
  );
}
