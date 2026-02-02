import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../hooks';
import { colors, borderRadius, spacing, typography } from '../../theme';
import { Toggle } from '../common';
import type { MenuItem } from '../../types';
import { Edit2, Leaf } from 'lucide-react-native';

interface MenuItemCardProps {
  item: MenuItem;
  onToggleAvailability: (id: string, available: boolean) => void;
  onEdit: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onToggleAvailability,
  onEdit,
}) => {
  const { currentColors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentColors.card,
          opacity: item.isAvailable ? 1 : 0.7,
        },
      ]}
    >
      {/* Left: Image or Veg Icon */}
      <View style={styles.imageContainer}>
        {item.isVeg ? (
          <View style={[styles.vegIcon, { borderColor: colors.success }]}>
            <Leaf size={16} color={colors.success} />
          </View>
        ) : (
          <View style={[styles.nonVegIcon, { borderColor: colors.error }]}>
            <View style={[styles.nonVegDot, { backgroundColor: colors.error }]} />
          </View>
        )}
      </View>

      {/* Middle: Content */}
      <View style={styles.content}>
        <Text
          style={[styles.name, { color: currentColors.text.primary }]
          }
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={[styles.price, { color: colors.primary.cyan }]}>
          ₹{item.price}
        </Text>
        <Text style={[styles.time, { color: currentColors.text.muted }]}>
          ⏱️ {item.preparationTime} min
        </Text>
        {!item.isAvailable && (
          <Text style={[styles.outOfStock, { color: colors.error }]}>
            OUT OF STOCK
          </Text>
        )}
      </View>

      {/* Right: Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(item)}
          style={[
            styles.editButton,
            { backgroundColor: currentColors.surface },
          ]}
        >
          <Edit2 size={16} color={colors.primary.cyan} />
        </TouchableOpacity>
        <Toggle
          value={item.isAvailable}
          onValueChange={(value) => onToggleAvailability(item.id, value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nonVegIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nonVegDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    marginLeft: spacing[3],
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[1],
  },
  price: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[0.5],
  },
  time: {
    fontSize: typography.sizes.xs,
  },
  outOfStock: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing[1],
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
});
