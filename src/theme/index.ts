import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows, borderRadius } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
};

export type Theme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
