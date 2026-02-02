import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks';
import { shadows, borderRadius } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  borderColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  borderColor,
}) => {
  const { currentColors, isDark } = useTheme();

  const getCardStyle = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: currentColors.card,
      borderRadius: borderRadius.xl,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: borderColor || currentColors.border,
        };
      case 'elevated':
        return {
          ...baseStyle,
          ...shadows.lg,
        };
      default:
        return {
          ...baseStyle,
          ...shadows.md,
        };
    }
  };

  const content = (
    <View style={[styles.card, getCardStyle(), style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
