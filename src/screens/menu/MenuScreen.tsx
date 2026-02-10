import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../hooks';
import { MenuItemCard } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Plus, ChevronDown, RefreshCw, Package } from 'lucide-react-native';
import {
  getProducts,
  getCategories,
  toggleProductStatus,
  deleteProduct,
  seedSampleProducts,
  Product,
  Category,
  getStatusDisplay,
  formatPrice,
} from '../../api/menuApi';

// Extended MenuItem type that maps Product to the component's expected format
interface MenuItemViewModel {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  image?: string;
  isAvailable: boolean;
  status: 'pending' | 'approved' | 'rejected';
  stock: number;
  quantity: string;
}

export const MenuScreen: React.FC = () => {
  const { currentColors } = useTheme();
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
        // If no category selected and we have categories, select first
        if (selectedCategory === 'all' && categoriesRes.data.length > 0) {
          setSelectedCategory('all');
        }
      }
    } catch (error) {
      console.error('Failed to fetch menu data:', error);
      Alert.alert('Error', 'Failed to load menu items');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(false);
  }, []);

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category?._id === selectedCategory);

  // Group products by category for tab display
  const productsByCategory = categories.map(cat => ({
    category: cat,
    count: products.filter(p => p.category?._id === cat._id).length,
  }));

  const handleToggleAvailability = async (itemId: string, available: boolean) => {
    setActionLoading(itemId);
    try {
      const result = await toggleProductStatus(itemId);
      if (result.success) {
        // Update local state
        setProducts(prev =>
          prev.map(p =>
            p._id === itemId ? { ...p, isActive: result.data?.isActive ?? !p.isActive } : p
          )
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update status');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditItem = (product: Product) => {
    // TODO: Navigate to edit screen
    Alert.alert('Edit Item', `Edit ${product.name}\n\nThis feature will open the edit product screen.`);
  };

  const handleDeleteItem = (product: Product) => {
    // Only allow deleting pending or rejected products
    if (product.status === 'approved') {
      Alert.alert('Cannot Delete', 'Approved products cannot be deleted. Contact admin for assistance.');
      return;
    }

    Alert.alert(
      'Delete Item?',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(product._id);
            try {
              const result = await deleteProduct(product._id);
              if (result.success) {
                setProducts(prev => prev.filter(p => p._id !== product._id));
              } else {
                Alert.alert('Error', result.error || 'Failed to delete item');
              }
            } catch (error) {
              Alert.alert('Error', 'Something went wrong');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  // Seed sample products for testing
  const handleSeedSampleProducts = async () => {
    setIsSeeding(true);
    try {
      const results = await seedSampleProducts();
      const successCount = results.filter(r => r.success).length;
      Alert.alert(
        'Sample Products Added',
        `Created ${successCount} sample menu items for testing.`,
        [{ text: 'OK', onPress: () => fetchData() }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create sample products'
      );
    } finally {
      setIsSeeding(false);
    }
  };

  const renderCategoryTab = (category: Category, count: number) => (
    <TouchableOpacity
      key={category._id}
      style={[
        styles.categoryTab,
        selectedCategory === category._id && [
          styles.activeCategoryTab,
          { backgroundColor: colors.primary.cyan },
        ],
      ]}
      onPress={() => setSelectedCategory(category._id)}
    >
      <Text
        style={[
          styles.categoryTabText,
          {
            color:
              selectedCategory === category._id
                ? colors.primary.dark
                : currentColors.text.secondary,
          },
        ]}
      >
        {category.name}
      </Text>
      {count > 0 && (
        <View style={[styles.countBadge, { backgroundColor: selectedCategory === category._id ? colors.primary.dark : currentColors.border }]}>
          <Text style={[styles.countText, { color: selectedCategory === category._id ? colors.primary.cyan : currentColors.text.muted }]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => {
    const statusDisplay = getStatusDisplay(item.status);
    const isLoading = actionLoading === item._id;

    return (
      <View style={[styles.productCard, { backgroundColor: currentColors.surface }]}>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: currentColors.text.primary }]}>
              {item.name}
            </Text>
            <Text style={[styles.productDescription, { color: currentColors.text.secondary }]} numberOfLines={2}>
              {item.description || 'No description'}
            </Text>
            <View style={styles.productMeta}>
              <Text style={[styles.productPrice, { color: colors.primary.cyan }]}>
                {formatPrice(item.price)}
              </Text>
              <Text style={[styles.productQuantity, { color: currentColors.text.muted }]}>
                • {item.quantity}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusDisplay.color}20` }]}>
                <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                  {statusDisplay.text}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Stock indicator */}
          <View style={styles.stockContainer}>
            <Text style={[styles.stockLabel, { color: currentColors.text.muted }]}>Stock</Text>
            <Text style={[styles.stockValue, { color: item.stock < 10 ? colors.error : currentColors.text.primary }]}>
              {item.stock}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.productActions}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: currentColors.border }]}
            onPress={() => handleEditItem(item)}
            disabled={isLoading}
          >
            <Text style={[styles.actionText, { color: currentColors.text.secondary }]}>Edit</Text>
          </TouchableOpacity>

          {item.status !== 'approved' && (
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: colors.error }]}
              onPress={() => handleDeleteItem(item)}
              disabled={isLoading}
            >
              <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
            </TouchableOpacity>
          )}

          {item.status === 'approved' && (
            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: item.isActive ? colors.success : currentColors.border }
              ]}
              onPress={() => handleToggleAvailability(item._id, !item.isActive)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={currentColors.text.inverse} />
              ) : (
                <Text style={[styles.toggleText, { color: item.isActive ? colors.text.inverse : currentColors.text.secondary }]}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.cyan} />
        <Text style={[styles.loadingText, { color: currentColors.text.secondary }]}>
          Loading menu...
        </Text>
      </View>
    );
  }

  // Empty state - offer to seed sample products
  if (products.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentColors.text.primary }]}>
            Menu
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary.cyan }]}
            onPress={() => Alert.alert('Add Item', 'Navigate to add product screen')}
          >
            <Plus size={20} color={colors.primary.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyContainer}>
          <Package size={64} color={currentColors.text.muted} />
          <Text style={[styles.emptyTitle, { color: currentColors.text.primary }]}>
            No Menu Items
          </Text>
          <Text style={[styles.emptyText, { color: currentColors.text.secondary }]}>
            Your menu is empty. Add items for customers to order.
          </Text>
          
          <TouchableOpacity
            style={[styles.seedButton, { backgroundColor: colors.primary.cyan }]}
            onPress={handleSeedSampleProducts}
            disabled={isSeeding}
          >
            {isSeeding ? (
              <ActivityIndicator size="small" color={colors.primary.dark} />
            ) : (
              <>
                <RefreshCw size={20} color={colors.primary.dark} style={styles.seedIcon} />
                <Text style={[styles.seedButtonText, { color: colors.primary.dark }]}>
                  Add 10 Sample Items
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.addItemButton, { borderColor: currentColors.border }]}
            onPress={() => Alert.alert('Add Item', 'Navigate to add product screen')}
          >
            <Plus size={20} color={colors.primary.cyan} />
            <Text style={[styles.addItemText, { color: colors.primary.cyan }]}>
              Add Your First Item
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Menu ({products.length})
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary.cyan }]}
          onPress={() => Alert.alert('Add Item', 'Navigate to add product screen')}
        >
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
          {/* All tab */}
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === 'all' && [
                styles.activeCategoryTab,
                { backgroundColor: colors.primary.cyan },
              ],
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.categoryTabText,
                {
                  color:
                    selectedCategory === 'all'
                      ? colors.primary.dark
                      : currentColors.text.secondary,
                },
              ]}
            >
              All
            </Text>
            <View style={[styles.countBadge, { backgroundColor: selectedCategory === 'all' ? colors.primary.dark : currentColors.border }]}>
              <Text style={[styles.countText, { color: selectedCategory === 'all' ? colors.primary.cyan : currentColors.text.muted }]}>
                {products.length}
              </Text>
            </View>
          </TouchableOpacity>

          {productsByCategory.map(({ category, count }) => renderCategoryTab(category, count))}
        </ScrollView>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.cyan}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={[styles.emptyListText, { color: currentColors.text.muted }]}>
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
  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.sizes.md,
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
  countBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
    marginLeft: spacing[1.5],
  },
  countText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
  },
  listContent: {
    padding: spacing[4],
    gap: spacing[4],
  },
  productCard: {
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  productName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[1],
  },
  productDescription: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing[2],
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  productPrice: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.bold,
  },
  productQuantity: {
    fontSize: typography.sizes.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  stockContainer: {
    alignItems: 'center',
    minWidth: 50,
  },
  stockLabel: {
    fontSize: typography.sizes.xs,
    marginBottom: spacing[1],
  },
  stockValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
  },
  productActions: {
    flexDirection: 'row',
    marginTop: spacing[3],
    gap: spacing[2],
  },
  actionButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  toggleButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    marginLeft: 'auto',
  },
  toggleText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  seedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[4],
  },
  seedIcon: {
    marginRight: spacing[2],
  },
  seedButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.bold,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  addItemText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing[2],
  },
  emptyListContainer: {
    paddingTop: spacing[10],
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: typography.sizes.md,
  },
});
