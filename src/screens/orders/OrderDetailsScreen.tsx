import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { Card, Button } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { OrdersStackParamList } from '../../navigation/MainNavigator';
import {
  getOrderById,
  acceptOrder,
  rejectOrder,
  markOrderPreparing,
  formatOrderForDisplay,
  getStatusColor,
  getStatusDisplayText,
  Order,
} from '../../api/ordersApi';
import { websocketService, useOrderUpdate } from '../../services/websocket';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  Package,
  CreditCard,
  MessageSquare,
} from 'lucide-react-native';

type RouteProps = RouteProp<OrdersStackParamList, 'OrderDetails'>;

export const OrderDetailsScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const orderId = route.params.orderId;

  // Join order room for real-time updates
  useEffect(() => {
    websocketService.joinOrderRoom(orderId);
    
    return () => {
      websocketService.leaveOrderRoom(orderId);
    };
  }, [orderId]);

  // Listen for order updates
  useOrderUpdate((data) => {
    if (data.orderId === orderId) {
      // Refresh order data
      fetchOrder();
    }
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await getOrderById(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        Alert.alert('Error', 'Failed to load order details');
        navigation.goBack();
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      Alert.alert('Error', 'Network error. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      const response = await acceptOrder(orderId);
      if (response.success) {
        Alert.alert('Success', 'Order accepted!');
        setOrder((prev) => prev ? { ...prev, status: 'confirmed' } : null);
      } else {
        Alert.alert('Error', response.error || 'Failed to accept order');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await rejectOrder(orderId, rejectReason);
      if (response.success) {
        Alert.alert('Order Rejected', 'The order has been rejected.');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.error || 'Failed to reject order');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPreparing = async () => {
    setActionLoading(true);
    try {
      const response = await markOrderPreparing(orderId, 20);
      if (response.success) {
        Alert.alert(
          'Preparing Started', 
          'Order marked as preparing. Looking for nearby drivers...'
        );
        setOrder((prev) => prev ? { 
          ...prev, 
          status: 'preparing',
          preparingStartedAt: new Date().toISOString(),
        } : null);
      } else {
        Alert.alert('Error', response.error || 'Failed to mark preparing');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCallCustomer = () => {
    if (order?.customer?.phone) {
      // In a real app, use Linking to open phone dialer
      Alert.alert('Call Customer', `Dialing ${order.customer.phone}`);
    }
  };

  const handleCallDriver = () => {
    if (order?.deliveryPartner?.phone) {
      Alert.alert('Call Driver', `Dialing ${order.deliveryPartner.phone}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.cyan} />
        <Text style={[styles.loadingText, { color: currentColors.text.secondary }]}>
          Loading order details...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: currentColors.text.primary }}>Order not found</Text>
      </View>
    );
  }

  const displayOrder = formatOrderForDisplay(order);
  const statusColor = getStatusColor(order.status);
  const statusText = getStatusDisplayText(order.status);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: currentColors.text.primary }]}>
            Order #{displayOrder.orderNumber}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Customer Info */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
            CUSTOMER
          </Text>
          <View style={styles.customerRow}>
            <View>
              <Text style={[styles.customerName, { color: currentColors.text.primary }]}>
                {displayOrder.customerName}
              </Text>
              <Text style={[styles.customerPhone, { color: currentColors.text.secondary }]}>
                {displayOrder.customerPhone}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: currentColors.surface }]}
              onPress={handleCallCustomer}
            >
              <Phone size={20} color={colors.primary.cyan} />
            </TouchableOpacity>
          </View>
          <View style={[styles.addressRow, { marginTop: spacing[3] }]}>
            <MapPin size={16} color={currentColors.text.muted} />
            <Text style={[styles.addressText, { color: currentColors.text.secondary }]}>
              {displayOrder.deliveryAddress}
            </Text>
          </View>
        </Card>

        {/* Order Items */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
            ORDER ITEMS ({displayOrder.items.length})
          </Text>
          {displayOrder.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: currentColors.text.primary }]}>
                  {item.name}
                </Text>
                {item.addOns && item.addOns.length > 0 && (
                  <Text style={[styles.addOns, { color: currentColors.text.muted }]}>
                    + {item.addOns.join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.itemPrice}>
                <Text style={[styles.quantity, { color: currentColors.text.secondary }]}>
                  x{item.quantity}
                </Text>
                <Text style={[styles.price, { color: currentColors.text.primary }]}>
                  Rs.{item.price * item.quantity}
                </Text>
              </View>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: currentColors.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: currentColors.text.primary }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary.cyan }]}>
              Rs.{displayOrder.total}
            </Text>
          </View>
        </Card>

        {/* Order Info */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
            ORDER INFO
          </Text>
          <View style={styles.infoRow}>
            <Clock size={16} color={currentColors.text.muted} />
            <Text style={[styles.infoText, { color: currentColors.text.secondary }]}>
              Ordered {displayOrder.timestamp}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <CreditCard size={16} color={currentColors.text.muted} />
            <Text style={[styles.infoText, { color: currentColors.text.secondary }]}>
              {displayOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </Text>
          </View>
          {displayOrder.estimatedReadyTime && (
            <View style={styles.infoRow}>
              <Package size={16} color={currentColors.text.muted} />
              <Text style={[styles.infoText, { color: colors.success }]}>
                Ready in {displayOrder.estimatedReadyTime}
              </Text>
            </View>
          )}
          {displayOrder.specialInstructions && (
            <View style={styles.infoRow}>
              <MessageSquare size={16} color={currentColors.text.muted} />
              <Text style={[styles.infoText, { color: currentColors.text.secondary }]}>
                {displayOrder.specialInstructions}
              </Text>
            </View>
          )}
        </Card>

        {/* Delivery Partner */}
        {displayOrder.deliveryPartner && (
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
              DELIVERY PARTNER
            </Text>
            <View style={styles.partnerRow}>
              <View style={styles.partnerInfo}>
                <Text style={[styles.partnerName, { color: currentColors.text.primary }]}>
                  {displayOrder.deliveryPartner.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Text style={[styles.ratingText, { color: colors.success }]}>
                    Rating: {displayOrder.deliveryPartner.rating}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.callButton, { backgroundColor: colors.primary.cyan }]}
                onPress={handleCallDriver}
              >
                <Phone size={20} color={colors.primary.dark} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Actions */}
      {order.status === 'pending_seller_approval' && (
        <View style={[styles.bottomActions, { backgroundColor: currentColors.card }]}>
          <Button
            title="Decline"
            variant="outline"
            onPress={() => setShowRejectDialog(true)}
            style={{ flex: 1, marginRight: spacing[2] }}
            disabled={actionLoading}
          />
          <Button
            title="Accept Order"
            onPress={handleAccept}
            style={{ flex: 2 }}
            disabled={actionLoading}
            loading={actionLoading}
          />
        </View>
      )}

      {(order.status === 'confirmed' || order.status === 'available') && (
        <View style={[styles.bottomActions, { backgroundColor: currentColors.card }]}>
          <Button
            title="Start Preparing"
            onPress={handleMarkPreparing}
            style={{ flex: 1 }}
            disabled={actionLoading}
            loading={actionLoading}
          />
        </View>
      )}

      {order.status === 'preparing' && (
        <View style={[styles.bottomActions, { backgroundColor: currentColors.card }]}>
          <Button
            title="Mark Ready for Pickup"
            variant="outline"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
            style={{ flex: 1 }}
            disabled={actionLoading}
          />
        </View>
      )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[14],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.md,
    marginTop: spacing[1],
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
  },
  scrollContent: {
    padding: spacing[4],
  },
  section: {
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[3],
    letterSpacing: 0.5,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
  },
  customerPhone: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[1],
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: typography.sizes.sm,
    marginLeft: spacing[2],
    flex: 1,
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.medium,
  },
  addOns: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[0.5],
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  quantity: {
    fontSize: typography.sizes.sm,
  },
  price: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing[0.5],
  },
  divider: {
    height: 1,
    marginVertical: spacing[3],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
  },
  totalValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  infoText: {
    fontSize: typography.sizes.sm,
    marginLeft: spacing[3],
  },
  partnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: spacing[1],
  },
  ratingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPadding: {
    height: spacing[20],
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: spacing[4],
    paddingBottom: spacing[6],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
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
