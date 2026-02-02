import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks';
import { colors, borderRadius, spacing, typography } from '../../theme';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  subtitle,
}) => {
  const { currentColors } = useTheme();

  const isPositive = change && change >= 0;
  const changeColor = isPositive ? colors.success : colors.error;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.card },
      ]}
    >
      <Text style={[styles.title, { color: currentColors.text.secondary }]}>
        {title}
      </Text>
      <Text style={[styles.value, { color: currentColors.text.primary }]}>
        {value}
      </Text>
      {change !== undefined && (
        <View style={styles.changeRow}>
          <ChangeIcon size={12} color={changeColor} />
          <Text style={[styles.change, { color: changeColor }]}>
            {isPositive ? '+' : ''}{change}%
          </Text>
        </View>
      )}
      {subtitle && (
        <Text style={[styles.subtitle, { color: currentColors.text.muted }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing[1],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[2],
  },
  value: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[1],
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing[1],
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[1],
  },
});
