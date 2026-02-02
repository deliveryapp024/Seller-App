import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks';
import { OrderCard } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { mockOrders } from '../../data/mockData';
import type { Order } from '../../types';
import { OrdersStackParamList } from '../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<OrdersStackParamList>;

type TabType = 'new' | 'active' | 'history';

export const OrdersScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('new');

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'new':
        return mockOrders.filter(o => o.status === 'new');
      case 'active':
        return mockOrders.filter(o => ['accepted', 'preparing', 'ready', 'picked_up'].includes(o.status));
      case 'history':
        return mockOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));
      default:
        return mockOrders;
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    console.log('Accept order:', orderId);
  };

  const handleMarkReady = (orderId: string) => {
    console.log('Mark ready:', orderId);
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onPress={() => handleOrderPress(item)}
      onAccept={item.status === 'new' ? () => handleAcceptOrder(item.id) : undefined}
      onMarkReady={item.status === 'preparing' ? () => handleMarkReady(item.id) : undefined}
    />
  );

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'new', label: 'New', count: mockOrders.filter(o => o.status === 'new').length },
    { key: 'active', label: 'Active', count: mockOrders.filter(o => ['accepted', 'preparing', 'ready', 'picked_up'].includes(o.status)).length },
    { key: 'history', label: 'History' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Orders
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: currentColors.card }]}>
        {tabs.map((tab) => (
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
            {tab.count !== undefined && tab.count > 0 && (
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
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <FlatList
        data={getFilteredOrders()}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: currentColors.text.muted }]}>
              No {activeTab} orders
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
    paddingTop: spacing[14],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
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
  },
  emptyText: {
    fontSize: typography.sizes.md,
  },
});
