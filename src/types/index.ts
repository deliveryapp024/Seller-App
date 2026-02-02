export interface Order {
  id: string;
  orderNumber: string;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  timestamp: string;
  estimatedReadyTime?: string;
  specialInstructions?: string;
  paymentMethod: 'cod' | 'online';
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  addOns?: string[];
  specialInstructions?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  isAvailable: boolean;
  isVeg: boolean;
  preparationTime: number;
  addOns?: AddOn[];
  tags?: string[];
  popularity?: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
  isAvailable: boolean;
}

export interface Payout {
  id: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  commission: number;
  deliveryFee: number;
  packagingFee: number;
  adjustments: number;
  netPayout: number;
  status: 'pending' | 'processing' | 'completed';
  transactionId?: string;
}

export interface EarningsData {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  chartData: { label: string; value: number }[];
}

export interface PerformanceMetrics {
  acceptanceRate: number;
  acceptanceChange: number;
  onTimeRate: number;
  onTimeChange: number;
  completionRate: number;
  completionChange: number;
  rating: number;
  ratingChange: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  outletName: string;
  outletId: string;
  isOnline: boolean;
  rating: number;
  totalOrders: number;
}

export type ThemeMode = 'light' | 'dark';
