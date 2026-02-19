import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks';
import { OrderCard } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { OrdersStackParamList } from '../../navigation/MainNavigator';
import {
  getOrders,
  getPendingOrders,
  acceptOrder,
  markOrderPreparing,
  formatOrderForDisplay,
  isOrderInTab,
  Order,
  OrderStatus,
  UIOrderStatus,
} from '../../api/ordersApi';
import { websocketService, useNewOrder, useOrderUpdate } from '../../services/websocket';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants/apiConfig';

type NavigationProp = NativeStackNavigationProp<OrdersStackParamList>;

type TabType = 'new' | 'active' | 'history';

export const OrdersScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);

  // Load seller ID on mount
  useEffect(() => {
    const loadSellerId = async () => {
      const userData = await storage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        setSellerId(user.id || user._id);
      }
    };
    loadSellerId();
  }, []);

  // Connect WebSocket when sellerId is available
  useEffect(() => {
    if (sellerId) {
      websocketService.connect(sellerId);
    }
    
    return () => {
      // Don't disconnect on unmount - keep listening for notifications
      // websocketService.disconnect();
    };
  }, [sellerId]);

  // Listen for new orders via WebSocket
  useNewOrder((data) => {
    console.log('[OrdersScreen] New order received via WebSocket:', data.order.orderId);
    // Refresh orders to show the new one
    fetchOrders();
    
    // Show alert for new order
    if (activeTab !== 'new') {
      Alert.alert(
        'New Order!',
        `Order #${data.order.orderId} - Rs.${data.order.totalPrice}`,
        [
          { text: 'View', onPress: () => setActiveTab('new') },
          { text: 'OK', style: 'cancel' },
        ]
      );
    }
  });

  // Listen for order updates
  useOrderUpdate((data) => {
    console.log('[OrdersScreen] Order update received:', data.orderId, data.status);
    // Update the order in the list
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === data.orderId
          ? { ...order, status: data.status as OrderStatus }
          : order
      )
    );
  });

  // Fetch orders when tab changes
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // Refresh orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [activeTab])
  );

  const fetchOrders = async (isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }
    setError(null);

    try {
      let response;

      if (activeTab === 'new') {
        // For new tab, fetch pending orders
        response = await getPendingOrders();
      } else if (activeTab === 'active') {
        // For active tab, fetch orders with active statuses
        response = await getOrders([
          'confirmed',
          'preparing',
          'ready_for_pickup',
          'driver_assigned',
          'driver_arrived',
          'picked_up',
          'out_for_delivery',
          'arriving',
        ]);
      } else {
        // For history tab, fetch delivered and cancelled orders
        response = await getOrders(['delivered', 'cancelled', 'seller_rejected']);
      }

      if (response.success) {
        const fetchedOrders = activeTab === 'new'
          ? response.data.orders
          : response.data.orders;
        setOrders(fetchedOrders);
      } else {
        setError(response.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(true);
  };

  const handleAcceptOrder = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const response = await acceptOrder(orderId);
      if (response.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: 'confirmed' as OrderStatus }
              : order
          )
        );
        Alert.alert('Success', 'Order accepted successfully!');
        // Refresh to move to active tab
        fetchOrders();
      } else {
        Alert.alert('Error', response.error || 'Failed to accept order');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPreparing = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const response = await markOrderPreparing(orderId, 20); // 20 min prep time
      if (response.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { 
                  ...order, 
                  status: 'preparing' as OrderStatus,
                  preparingStartedAt: new Date().toISOString(),
                  estimatedReadyAt: response.data?.order?.estimatedReadyAt,
                }
              : order
          )
        );
        Alert.alert('Success', 'Order marked as preparing. Driver assignment started!');
      } else {
        Alert.alert('Error', response.error || 'Failed to mark preparing');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    // For now, we don't have a direct "ready" endpoint, so we use preparing
    // The server should have a ready endpoint - this is a placeholder
    Alert.alert('Coming Soon', 'Ready for pickup feature will be available soon.');
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetails', { orderId: order._id });
  };

  const getFilteredOrders = () => {
    return orders.filter((order) => isOrderInTab(order, activeTab));
  };

  const getTabCount = (tab: TabType): number => {
    return orders.filter((order) => isOrderInTab(order, tab)).length;
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const displayOrder = formatOrderForDisplay(item);
    const uiStatus = displayOrder.status;
    const cardStatus: UIOrderStatus | 'accepted' = uiStatus === 'active' ? 'accepted' : uiStatus;
    
    return (
      <OrderCard
        order={{
          id: displayOrder.id,
          orderNumber: displayOrder.orderNumber,
          status: cardStatus,
          items: displayOrder.items,
          total: displayOrder.total,
          customerName: displayOrder.customerName,
          customerPhone: displayOrder.customerPhone,
          deliveryAddress: displayOrder.deliveryAddress,
          timestamp: displayOrder.timestamp,
          paymentMethod: displayOrder.paymentMethod as 'cod' | 'online',
          specialInstructions: displayOrder.specialInstructions,
          estimatedReadyTime: displayOrder.estimatedReadyTime,
          deliveryPartner: displayOrder.deliveryPartner,
        }}
        onPress={() => handleOrderPress(item)}
        onAccept={uiStatus === 'new' ? () => handleAcceptOrder(item._id) : undefined}
        onMarkReady={
          uiStatus === 'preparing' 
            ? () => handleMarkReady(item._id)
            : uiStatus === 'active'
            ? () => handleMarkPreparing(item._id)
            : undefined
        }
      />
    );
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'new', label: 'New' },
    { key: 'active', label: 'Active' },
    { key: 'history', label: 'History' },
  ];

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.cyan} />
        <Text style={[styles.loadingText, { color: currentColors.text.secondary }]}>
          Loading orders...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Orders
        </Text>
        {websocketService.isConnected() && (
          <View style={[styles.connectionBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.connectionText}>Live</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: currentColors.card }]}>
        {tabs.map((tab) => {
          const count = getTabCount(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && [
                  styles.activeTab,
                  { borderBottomColor: colors.primary.cyan },
                ],
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.key
                        ? colors.primary.cyan
                        : currentColors.text.secondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
              {count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor:
                        activeTab === tab.key
                          ? colors.primary.cyan
                          : currentColors.surface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      {
                        color:
                          activeTab === tab.key
                            ? colors.primary.dark
                            : currentColors.text.secondary,
                      },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <TouchableOpacity onPress={() => fetchOrders()}>
            <Text style={[styles.retryText, { color: colors.primary.cyan }]}>
              Tap to retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Orders List */}
      <FlatList
        data={getFilteredOrders()}
        renderItem={renderOrder}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.cyan}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: currentColors.text.muted }]}>
              No {activeTab} orders
            </Text>
            {activeTab === 'new' && (
              <Text style={[styles.emptySubtext, { color: currentColors.text.muted }]}>
                New orders will appear here when customers place them
              </Text>
            )}
          </View>
        }
      />

      {/* Action Loading Overlay */}
      {actionLoading && (
        <View style={styles.actionOverlay}>
          <ActivityIndicator size="large" color={colors.primary.cyan} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing[14],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  connectionBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  connectionText: {
    color: colors.primary.dark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  countBadge: {
    marginLeft: spacing[1.5],
    paddingHorizontal: spacing[1.5],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
  },
  listContent: {
    paddingVertical: spacing[2],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing[20],
    paddingHorizontal: spacing[8],
  },
  emptyText: {
    fontSize: typography.sizes.md,
    marginBottom: spacing[2],
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  errorContainer: {
    padding: spacing[4],
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.sizes.md,
    marginBottom: spacing[2],
  },
  retryText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.sizes.md,
  },
  actionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
