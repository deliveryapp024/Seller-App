import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface StatusBadgeProps {
  isOnline: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isOnline }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.pulse, isOnline && styles.pulseAnimation]}>
        <View style={[styles.dot, { backgroundColor: isOnline ? colors.success : colors.error }]} />
      </View>
      <Text style={[styles.text, { color: isOnline ? colors.success : colors.error }]}>
        {isOnline ? 'Online' : 'Offline'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  pulseAnimation: {
    backgroundColor: `${colors.success}30`,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
});
