import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks';
import { MenuItemCard } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { mockCategories } from '../../data/mockData';
import type { MenuItem, Category } from '../../types';
import { Plus, ChevronDown } from 'lucide-react-native';

export const MenuScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>(mockCategories[0].id);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const currentCategory = categories.find(c => c.id === selectedCategory);

  const handleToggleAvailability = (itemId: string, available: boolean) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === selectedCategory
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, isAvailable: available } : item
              ),
            }
          : cat
      )
    );
  };

  const handleEditItem = (item: MenuItem) => {
    console.log('Edit item:', item);
  };

  const renderCategoryTab = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.id && [
          styles.activeCategoryTab,
          { backgroundColor: colors.primary.cyan },
        ],
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text
        style={[
          styles.categoryTabText,
          {
            color:
              selectedCategory === category.id
                ? colors.primary.dark
                : currentColors.text.secondary,
          },
        ]}
      >
        {category.name}
      </Text>
      {!category.isAvailable && (
        <View style={[styles.unavailableDot, { backgroundColor: colors.error }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Menu
        </Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary.cyan }]}>
          <Plus size={20} color={colors.primary.dark} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(renderCategoryTab)}
        </ScrollView>
      </View>

      {/* Category Header */}
      {currentCategory && (
        <View style={styles.categoryHeader}>
          <Text style={[styles.categoryName, { color: currentColors.text.primary }]}>
            {currentCategory.name}
          </Text>
          <TouchableOpacity style={styles.categoryActions}>
            <Text style={[styles.categoryActionText, { color: colors.primary.cyan }]}>
              {currentCategory.isAvailable ? 'Available' : 'Unavailable'}
            </Text>
            <ChevronDown size={16} color={colors.primary.cyan} />
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Items */}
      <FlatList
        data={currentCategory?.items || []}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            onToggleAvailability={handleToggleAvailability}
            onEdit={handleEditItem}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: currentColors.text.muted }]}>
              No items in this category
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[14],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: spacing[4],
  },
  categoriesScroll: {
    paddingHorizontal: spacing[4],
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    borderRadius: borderRadius.full,
    marginRight: spacing[2],
    backgroundColor: 'transparent',
  },
  activeCategoryTab: {
    borderRadius: borderRadius.full,
  },
  categoryTabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  unavailableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: spacing[1.5],
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
  },
  categoryName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeight.bold,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryActionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
    marginRight: spacing[1],
  },
  listContent: {
    paddingVertical: spacing[2],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing[20],
  },
  emptyText: {
    fontSize: typography.sizes.md,
  },
});
