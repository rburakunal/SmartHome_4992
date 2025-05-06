import { Colors } from '@/constants/Colors';

export function useFixedThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const colorFromProps = props['light'];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors['light'][colorName];
  }
} 