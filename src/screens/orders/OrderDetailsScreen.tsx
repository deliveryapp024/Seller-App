import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { Card, Button } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { mockOrders } from '../../data/mockData';
import { OrdersStackParamList } from '../../navigation/MainNavigator';
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
  
  const order = mockOrders.find(o => o.id === route.params.orderId);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <Text style={{ color: currentColors.text.primary }}>Order not found</Text>
      </View>
    );
  }

  const getStatusColor = () => {
    switch (order.status) {
      case 'new': return colors.error;
      case 'accepted':
      case 'preparing': return colors.warning;
      case 'ready': return colors.primary.cyan;
      case 'picked_up': return colors.info;
      case 'delivered': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.primary.cyan;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: currentColors.text.primary }]}>
            Order #{order.orderNumber}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {order.status.toUpperCase().replace('_', ' ')}
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
                {order.customerName}
              </Text>
              <Text style={[styles.customerPhone, { color: currentColors.text.secondary }]}>
                {order.customerPhone}
              </Text>
            </View>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: currentColors.surface }]}>
              <Phone size={20} color={colors.primary.cyan} />
            </TouchableOpacity>
          </View>
          <View style={[styles.addressRow, { marginTop: spacing[3] }]}>
            <MapPin size={16} color={currentColors.text.muted} />
            <Text style={[styles.addressText, { color: currentColors.text.secondary }]}>
              {order.deliveryAddress}
            </Text>
          </View>
        </Card>

        {/* Order Items */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
            ORDER ITEMS ({order.items.length})
          </Text>
          {order.items.map((item, idx) => (
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
                  ₹{item.price * item.quantity}
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
              ₹{order.total}
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
              Ordered {order.timestamp}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <CreditCard size={16} color={currentColors.text.muted} />
            <Text style={[styles.infoText, { color: currentColors.text.secondary }]}>
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </Text>
          </View>
          {order.specialInstructions && (
            <View style={styles.infoRow}>
              <MessageSquare size={16} color={currentColors.text.muted} />
              <Text style={[styles.infoText, { color: currentColors.text.secondary }]}>
                {order.specialInstructions}
              </Text>
            </View>
          )}
        </Card>

        {/* Delivery Partner */}
        {order.deliveryPartner && (
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
              DELIVERY PARTNER
            </Text>
            <View style={styles.partnerRow}>
              <View style={styles.partnerInfo}>
                <Text style={[styles.partnerName, { color: currentColors.text.primary }]}>
                  {order.deliveryPartner.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Text style={[styles.ratingText, { color: colors.success }]}>
                    ⭐ {order.deliveryPartner.rating}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.primary.cyan }]}>
                <Phone size={20} color={colors.primary.dark} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Actions */}
      {order.status === 'new' && (
        <View style={[styles.bottomActions, { backgroundColor: currentColors.card }]}>
          <Button
            title="Decline"
            variant="outline"
            onPress={() => {}}
            style={{ flex: 1, marginRight: spacing[2] }}
          />
          <Button
            title="Accept Order"
            onPress={() => {}}
            style={{ flex: 2 }}
          />
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
});
