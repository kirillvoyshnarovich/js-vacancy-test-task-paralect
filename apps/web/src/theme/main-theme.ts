import { createTheme, MantineColorsTuple } from '@mantine/core';

import * as components from './components';

const colorsBlue: MantineColorsTuple = [
  '#e5f4ff',
  '#d1e3ff',
  '#a2c5f9',
  '#71a4f3',
  '#4789ee',
  '#2c78eb',
  '#196feb',
  '#075ed1',
  '#0053bd',
  '#0048a7',
];

const mainTheme = createTheme({
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },
  lineHeights: {
    md: '1.45',
  },
  primaryColor: 'blue',
  colors: {
    blue: colorsBlue,
  },
  black: '#201F22',
  primaryShade: 5,
  components,
  defaultRadius: 8,
});

export default mainTheme;
