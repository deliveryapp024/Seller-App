import { apiClient, ApiResponse } from './client';

// Order status types matching the server
export type OrderStatus =
  | 'pending_seller_approval'
  | 'seller_rejected'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'picked_up'
  | 'out_for_delivery'
  | 'arriving'
  | 'delivered'
  | 'cancelled'
  | 'no_drivers_available'
  | 'available';

// UI-friendly status mapping
export type UIOrderStatus = 'new' | 'active' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

export interface OrderItem {
  _id?: string;
  id?: string;
  item?: {
    _id: string;
    name: string;
    price: number;
  };
  name?: string;
  price?: number;
  count?: number;
  quantity?: number;
  addOns?: string[];
}

export interface DeliveryAddressSnapshot {
  addressId?: string;
  label?: string;
  houseNumber?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
}

export interface DeliveryPartner {
  _id: string;
  name: string;
  phone: string;
  rating?: number;
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
}

export interface Order {
  _id: string;
  orderId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  customer: Customer;
  deliveryAddressSnapshot?: DeliveryAddressSnapshot;
  deliveryLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  branch?: Branch;
  deliveryPartner?: DeliveryPartner;
  createdAt: string;
  updatedAt: string;
  sellerResponse?: {
    status: 'pending' | 'accepted' | 'rejected';
    responseTime?: string;
    rejectionReason?: string;
  };
  paymentMethod?: 'cod' | 'online' | 'wallet';
  specialInstructions?: string;
  estimatedReadyAt?: string;
  preparingStartedAt?: string;
}

export interface OrdersResponse {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
}

export interface PendingOrdersResponse {
  orders: Order[];
}

export interface AcceptOrderResponse {
  message: string;
  order: Order;
}

export interface RejectOrderRequest {
  rejectionReason: string;
}

export interface MarkPreparingRequest {
  estimatedPrepTime?: number; // in minutes
}

export interface MarkPreparingResponse {
  message: string;
  order: {
    _id: string;
    orderId: string;
    status: string;
    preparingStartedAt: string;
    estimatedReadyAt?: string;
  };
  driverAssignment?: {
    status: string;
    broadcastedTo: number;
  };
}

// Get orders with optional status filter
export const getOrders = async (
  status?: OrderStatus | OrderStatus[],
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<OrdersResponse>> => {
  let endpoint = `/seller/orders?page=${page}&limit=${limit}`;
  
  if (status) {
    if (Array.isArray(status)) {
      endpoint += `&status=${status.join(',')}`;
    } else {
      endpoint += `&status=${status}`;
    }
  }
  
  return apiClient.get<OrdersResponse>(endpoint);
};

// Get pending orders (awaiting seller approval)
export const getPendingOrders = async (): Promise<ApiResponse<PendingOrdersResponse>> => {
  return apiClient.get<PendingOrdersResponse>('/seller/orders/pending');
};

// Get a single order by ID (reuses getOrders with the order in results)
export const getOrderById = async (orderId: string): Promise<ApiResponse<Order>> => {
  // The server doesn't have a single order endpoint, so we fetch all and filter
  // Or we can use the orders endpoint with the orderId as a workaround
  // For now, let's fetch from the list and find the order
  const response = await apiClient.get<OrdersResponse>(`/seller/orders?limit=100`);
  
  if (response.success && response.data) {
    const order = response.data.orders.find(o => o._id === orderId || o.orderId === orderId);
    if (order) {
      return { success: true, data: order };
    }
    return { success: false, error: 'Order not found' };
  }
  
  return response as ApiResponse<Order>;
};

// Accept an order
export const acceptOrder = async (orderId: string): Promise<ApiResponse<AcceptOrderResponse>> => {
  return apiClient.post<AcceptOrderResponse>(`/seller/orders/${orderId}/accept`);
};

// Reject an order
export const rejectOrder = async (
  orderId: string,
  reason: string
): Promise<ApiResponse<AcceptOrderResponse>> => {
  return apiClient.post<AcceptOrderResponse>(`/seller/orders/${orderId}/reject`, {
    rejectionReason: reason,
  });
};

// Mark order as preparing (triggers driver assignment)
export const markOrderPreparing = async (
  orderId: string,
  estimatedPrepTime?: number
): Promise<ApiResponse<MarkPreparingResponse>> => {
  return apiClient.post<MarkPreparingResponse>(`/seller/orders/${orderId}/preparing`, {
    estimatedPrepTime,
  });
};

// Mark order as ready for pickup
// Note: This endpoint might need to be added to the server
export const markOrderReady = async (orderId: string): Promise<ApiResponse<{ message: string; order: Order }>> => {
  // Using a generic status update - server may need this endpoint added
  return apiClient.put<{ message: string; order: Order }>(`/seller/orders/${orderId}/status`, {
    status: 'ready_for_pickup',
  });
};

// Get dashboard metrics
export const getDashboardMetrics = async (): Promise<ApiResponse<{
  metrics: {
    totalOrders: number;
    pendingOrders: number;
    todayOrders: number;
    todayRevenue: number;
    monthlyRevenue: number;
    orderStatusBreakdown: Record<string, number>;
    recentOrders: Order[];
  };
}>> => {
  return apiClient.get('/seller/dashboard/metrics');
};

// Helper function to map server status to UI status
export const mapStatusToUI = (status: OrderStatus): UIOrderStatus => {
  switch (status) {
    case 'pending_seller_approval':
      return 'new';
    case 'confirmed':
    case 'available':
      return 'active';
    case 'preparing':
      return 'preparing';
    case 'ready_for_pickup':
      return 'ready';
    case 'driver_assigned':
    case 'driver_arrived':
    case 'picked_up':
    case 'out_for_delivery':
    case 'arriving':
      return 'picked_up';
    case 'delivered':
      return 'delivered';
    case 'cancelled':
    case 'seller_rejected':
    case 'no_drivers_available':
      return 'cancelled';
    default:
      return 'new';
  }
};

// Helper function to check if order is in a specific tab
export const isOrderInTab = (order: Order, tab: 'new' | 'active' | 'history'): boolean => {
  const uiStatus = mapStatusToUI(order.status);
  
  switch (tab) {
    case 'new':
      return uiStatus === 'new';
    case 'active':
      return ['active', 'preparing', 'ready', 'picked_up'].includes(uiStatus);
    case 'history':
      return ['delivered', 'cancelled'].includes(uiStatus);
    default:
      return false;
  }
};

// Helper function to format order for UI display
export const formatOrderForDisplay = (order: Order) => {
  const uiStatus = mapStatusToUI(order.status);
  
  // Format delivery address
  const address = order.deliveryAddressSnapshot;
  let deliveryAddress = order.deliveryLocation?.address || '';
  if (address) {
    const parts = [
      address.houseNumber,
      address.street,
      address.landmark,
      address.city,
    ].filter(Boolean);
    if (parts.length > 0) {
      deliveryAddress = parts.join(', ');
    }
  }
  
  // Format items
  const items = order.items.map(item => ({
    id: item._id || item.id || String(Math.random()),
    name: item.item?.name || item.name || 'Unknown Item',
    quantity: item.count || item.quantity || 1,
    price: item.item?.price || item.price || 0,
    addOns: item.addOns,
  }));
  
  // Format timestamp
  const createdAt = new Date(order.createdAt);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
  
  let timestamp: string;
  if (diffMinutes < 1) {
    timestamp = 'Just now';
  } else if (diffMinutes < 60) {
    timestamp = `${diffMinutes} min ago`;
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60);
    timestamp = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffMinutes / 1440);
    timestamp = `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  return {
    id: order._id,
    orderNumber: order.orderId,
    status: uiStatus,
    rawStatus: order.status,
    items,
    total: order.totalPrice,
    customerName: order.customer?.name || 'Unknown Customer',
    customerPhone: order.customer?.phone || '',
    deliveryAddress,
    timestamp,
    createdAt: order.createdAt,
    estimatedReadyTime: order.estimatedReadyAt 
      ? formatEstimatedTime(order.estimatedReadyAt)
      : undefined,
    specialInstructions: order.specialInstructions,
    paymentMethod: order.paymentMethod || 'online',
    deliveryPartner: order.deliveryPartner ? {
      name: order.deliveryPartner.name,
      phone: order.deliveryPartner.phone,
      rating: order.deliveryPartner.rating || 4.5,
    } : undefined,
  };
};

// Helper to format estimated time
const formatEstimatedTime = (estimatedReadyAt: string): string => {
  const readyTime = new Date(estimatedReadyAt);
  const now = new Date();
  const diffMinutes = Math.floor((readyTime.getTime() - now.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'Ready now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
};

// Helper function to get status color
export const getStatusColor = (status: UIOrderStatus | OrderStatus): string => {
  const colorMap: Record<string, string> = {
    new: '#FF5252',
    pending_seller_approval: '#FF5252',
    active: '#FFB300',
    confirmed: '#FFB300',
    available: '#FFB300',
    preparing: '#FFB300',
    ready: '#00E5FF',
    ready_for_pickup: '#00E5FF',
    picked_up: '#448AFF',
    driver_assigned: '#448AFF',
    driver_arrived: '#448AFF',
    out_for_delivery: '#448AFF',
    arriving: '#448AFF',
    delivered: '#00C853',
    cancelled: '#FF5252',
    seller_rejected: '#FF5252',
    no_drivers_available: '#FF5252',
  };
  
  return colorMap[status] || '#00E5FF';
};

// Helper function to get status display text
export const getStatusDisplayText = (status: UIOrderStatus | OrderStatus): string => {
  const textMap: Record<string, string> = {
    new: 'New Order',
    pending_seller_approval: 'New Order',
    active: 'Confirmed',
    confirmed: 'Confirmed',
    available: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    ready_for_pickup: 'Ready for Pickup',
    picked_up: 'Out for Delivery',
    driver_assigned: 'Driver Assigned',
    driver_arrived: 'Driver Arrived',
    out_for_delivery: 'Out for Delivery',
    arriving: 'Arriving',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    seller_rejected: 'Rejected',
    no_drivers_available: 'No Drivers',
  };
  
  return textMap[status] || status.replace(/_/g, ' ').toUpperCase();
};
