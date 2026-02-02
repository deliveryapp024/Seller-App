export const colors = {
  // Primary Palette
  primary: {
    cyan: '#00E5CC',
    teal: '#00BFA5',
    dark: '#0D1F1F',
    light: '#E8F4F4',
    cyanDark: '#00C4B0',
  },

  // Semantic Colors
  success: '#00C853',
  warning: '#FFB300',
  error: '#FF5252',
  info: '#448AFF',

  // Dark Mode
  dark: {
    background: '#0D1F1F',
    card: '#1A2F2F',
    surface: '#243838',
    border: 'rgba(0, 229, 204, 0.15)',
    text: {
      primary: '#FFFFFF',
      secondary: '#8A9A9A',
      muted: '#5A6A6A',
    },
    gradient: ['#1A2F2F', '#0D1F1F'],
  },

  // Light Mode
  light: {
    background: '#E8F4F4',
    card: '#FFFFFF',
    surface: '#F0F8F8',
    border: 'rgba(0, 191, 165, 0.15)',
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
      muted: '#9CA3AF',
    },
    gradient: ['#FFFFFF', '#E8F4F4'],
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type Colors = typeof colors;
