import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks';
import { colors, borderRadius, spacing, typography } from '../../theme';
import type { Order } from '../../types';
import { ChevronRight } from 'lucide-react-native';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onAccept?: () => void;
  onMarkReady?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onAccept,
  onMarkReady,
}) => {
  const { currentColors, isDark } = useTheme();

  const getStatusConfig = () => {
    switch (order.status) {
      case 'new':
        return { color: colors.error, label: 'NEW ORDER', animate: true };
      case 'accepted':
        return { color: colors.warning, label: 'ACCEPTED', animate: false };
      case 'preparing':
        return { color: colors.warning, label: 'PREPARING', animate: false };
      case 'ready':
        return { color: colors.primary.cyan, label: 'READY', animate: false };
      case 'picked_up':
        return { color: colors.info, label: 'PICKED UP', animate: false };
      case 'delivered':
        return { color: colors.success, label: 'DELIVERED', animate: false };
      case 'cancelled':
        return { color: colors.error, label: 'CANCELLED', animate: false };
      default:
        return { color: colors.primary.cyan, label: 'ORDER', animate: false };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: currentColors.card,
          borderLeftColor: statusConfig.color,
          shadowColor: isDark ? colors.primary.cyan : colors.black,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
        <Text style={[styles.timeText, { color: currentColors.text.muted }]}>
          {order.timestamp}
        </Text>
      </View>

      {/* Order ID */}
      <Text style={[styles.orderId, { color: currentColors.text.primary }]}>
        #{order.orderNumber}
      </Text>

      {/* Items */}
      <View style={styles.itemsContainer}>
        {order.items.slice(0, 2).map((item, idx) => (
          <Text
            key={idx}
            style={[styles.itemText, { color: currentColors.text.secondary }]}
          >
            {item.name} ({item.quantity}x)
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={[styles.moreText, { color: colors.primary.cyan }]}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.totalText, { color: colors.primary.cyan }]}>
          ₹{order.total.toFixed(2)}
        </Text>

        {order.status === 'new' && onAccept && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary.cyan }]}
            onPress={(e) => {
              e.stopPropagation();
              onAccept();
            }}
          >
            <Text style={styles.buttonText}>Accept →</Text>
          </TouchableOpacity>
        )}

        {order.status === 'preparing' && onMarkReady && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: colors.primary.cyan,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onMarkReady();
            }}
          >
            <Text style={[styles.buttonText, { color: colors.primary.cyan }]}>
              Mark Ready
            </Text>
          </TouchableOpacity>
        )}

        {['ready', 'picked_up', 'delivered'].includes(order.status) && (
          <ChevronRight size={20} color={currentColors.text.muted} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    borderLeftWidth: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[2],
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
  },
  timeText: {
    fontSize: typography.sizes.xs,
  },
  orderId: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[3],
  },
  itemsContainer: {
    marginBottom: spacing[4],
  },
  itemText: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing[1],
  },
  moreText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[1],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  actionButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2.5],
    borderRadius: borderRadius.lg,
  },
  buttonText: {
    color: colors.primary.dark,
    fontWeight: typography.fontWeight.semiBold,
    fontSize: typography.sizes.sm,
  },
});
