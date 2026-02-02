import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks';
import { colors, borderRadius, typography, spacing } from '../../theme';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'md',
  pulse = false,
}) => {
  const { currentColors } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: `${colors.success}20`, color: colors.success };
      case 'warning':
        return { backgroundColor: `${colors.warning}20`, color: colors.warning };
      case 'error':
        return { backgroundColor: `${colors.error}20`, color: colors.error };
      case 'info':
        return { backgroundColor: `${colors.info}20`, color: colors.info };
      case 'primary':
        return { backgroundColor: `${colors.primary.cyan}20`, color: colors.primary.cyan };
      default:
        return {
          backgroundColor: currentColors.surface,
          color: currentColors.text.secondary,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <View style={[styles.container, { backgroundColor: variantStyle.backgroundColor }]}>
      {pulse && <View style={[styles.pulse, { backgroundColor: variantStyle.color }]} />}
      <Text style={[styles.text, { color: variantStyle.color, fontSize: size === 'sm' ? typography.sizes.xs : typography.sizes.sm }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing[1.5],
  },
  text: {
    fontWeight: typography.fontWeight.semiBold,
  },
});
