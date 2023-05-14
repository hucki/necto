// theme.ts

// 1. import `extendTheme` function
import {
  extendTheme,
  theme as chakraTheme,
  type ThemeConfig,
} from '@chakra-ui/react';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  // useSystemColorMode: false,
};

const colors = {
  note: {
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
  },

  leave: {
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
  },
  mint: chakraTheme.colors.teal,
  grey: chakraTheme.colors.gray,
};

// 3. extend the theme
const theme = extendTheme({ config, colors });

export default theme;
