import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../hooks';
import { colors, borderRadius, typography } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { isDark } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };

    const sizeStyle: ViewStyle = {
      paddingVertical: size === 'sm' ? 8 : size === 'md' ? 12 : 16,
      paddingHorizontal: size === 'sm' ? 16 : size === 'md' ? 24 : 32,
    };

    let variantStyle: ViewStyle;
    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: colors.primary.cyan,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: colors.primary.teal,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary.cyan,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: colors.error,
        };
        break;
      default:
        variantStyle = { backgroundColor: colors.primary.cyan };
    }

    return { ...baseStyle, ...sizeStyle, ...variantStyle };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'sm' ? typography.sizes.sm : size === 'md' ? typography.sizes.md : typography.sizes.lg,
      fontWeight: typography.fontWeight.semiBold,
    };

    let colorStyle: TextStyle;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        colorStyle = { color: colors.primary.dark };
        break;
      case 'outline':
      case 'ghost':
        colorStyle = { color: colors.primary.cyan };
        break;
      default:
        colorStyle = { color: colors.primary.dark };
    }

    return { ...baseStyle, ...colorStyle };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getButtonStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' || variant === 'danger' ? colors.primary.dark : colors.primary.cyan}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), icon && styles.textWithIcon, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  textWithIcon: {
    marginLeft: 8,
  },
});
