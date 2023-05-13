import { theme } from '@chakra-ui/react';

// palettes from https://smart-swatch.netlify.app/
const note = {
  50: '#fdfae0',
  100: '#f6f0b8',
  200: '#f0e68e',
  300: '#eadd63',
  400: '#e5d339',
  500: '#cbb920',
  600: '#9e9018',
  700: '#71670f',
  800: '#443e06',
  900: '#181500',
};

const leave = {
  50: '#f2f2f2',
  100: '#d9d9d9',
  200: '#bfbfbf',
  300: '#a6a6a6',
  400: '#8c8c8c',
  500: '#737373',
  600: '#595959',
  700: '#404040',
  800: '#262626',
  900: '#0d0d0d',
};

export const colors = {
  note,
  leave,
  mint: theme.colors.teal,
  grey: theme.colors.gray,
  ...theme.colors,
};

export type Color = keyof typeof colors;
