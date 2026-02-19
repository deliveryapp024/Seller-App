import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../constants/apiConfig';
import { getAuthToken } from '../api/client';

// Event types
export type OrderUpdateEvent = {
  orderId: string;
  status: string;
  preparingStartedAt?: string;
  estimatedReadyAt?: string;
  driverAssignedAt?: string;
  deliveryPartner?: {
    _id: string;
    name: string;
    phone: string;
    rating: number;
  };
  pickedUpAt?: string;
  deliveredAt?: string;
};

export type NewOrderEvent = {
  order: {
    _id: string;
    orderId: string;
    status: string;
    items: any[];
    totalPrice: number;
    customer: {
      _id: string;
      name: string;
      phone: string;
    };
    deliveryAddressSnapshot?: any;
    deliveryLocation?: any;
    specialInstructions?: string;
    paymentMethod?: string;
    createdAt: string;
  };
};

export type DriverAssignmentEvent = {
  orderId: string;
  driver: {
    _id: string;
    name: string;
    phone: string;
    rating: number;
    vehicleType?: string;
    vehicleNumber?: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
  };
  estimatedArrival?: number; // minutes
};

export type DriverLocationUpdate = {
  orderId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  heading?: number;
  speed?: number;
};

// Event listener types
type EventCallback<T> = (data: T) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private eventListeners: Map<string, Set<EventCallback<any>>> = new Map();
  private sellerId: string | null = null;
  private recentEventKeys: Map<string, number> = new Map();

  private isDuplicateEvent(eventKey: string, dedupeWindowMs: number = 1500): boolean {
    const now = Date.now();
    const previous = this.recentEventKeys.get(eventKey);

    if (previous && now - previous < dedupeWindowMs) {
      return true;
    }

    this.recentEventKeys.set(eventKey, now);

    // Keep memory bounded.
    if (this.recentEventKeys.size > 100) {
      for (const [key, timestamp] of this.recentEventKeys) {
        if (now - timestamp > dedupeWindowMs * 5) {
          this.recentEventKeys.delete(key);
        }
      }
    }

    return false;
  }

  private normalizeNewOrderPayload = (payload: NewOrderEvent | NewOrderEvent['order']): NewOrderEvent => {
    if ((payload as NewOrderEvent).order) {
      return payload as NewOrderEvent;
    }

    return {
      order: payload as NewOrderEvent['order'],
    };
  };

  private handleIncomingNewOrder = (payload: NewOrderEvent | NewOrderEvent['order']): void => {
    const normalized = this.normalizeNewOrderPayload(payload);
    const orderId = normalized.order?._id || normalized.order?.orderId || 'unknown';
    const dedupeKey = `newOrder:${orderId}`;

    if (this.isDuplicateEvent(dedupeKey)) {
      return;
    }

    console.log('[WebSocket] New order received:', normalized.order.orderId || normalized.order._id);
    this.triggerEvent('newOrder', normalized);
  };

  private handleIncomingOrderUpdate = (payload: OrderUpdateEvent): void => {
    const normalized: OrderUpdateEvent = {
      ...payload,
      orderId: payload.orderId,
      status: payload.status,
    };

    const dedupeKey = `orderUpdate:${normalized.orderId}:${normalized.status}`;
    if (this.isDuplicateEvent(dedupeKey)) {
      return;
    }

    console.log('[WebSocket] Order update:', normalized.orderId, normalized.status);
    this.triggerEvent('orderUpdate', normalized);
  };

  // Initialize WebSocket connection
  connect(sellerId: string): void {
    if (this.socket?.connected) {
      console.log('[WebSocket] Already connected');
      return;
    }

    this.sellerId = sellerId;
    const token = getAuthToken();

    if (!token) {
      console.error('[WebSocket] No auth token available');
      return;
    }

    const wsUrl = API_CONFIG.API_ORIGIN; // e.g., http://10.0.2.2:5000

    console.log('[WebSocket] Connecting to:', wsUrl);

    this.socket = io(wsUrl, {
      transports: ['websocket'],
      query: {
        token,
        role: 'seller',
        sellerId,
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventHandlers();
  }

  // Setup socket event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected successfully');
      this.reconnectAttempts = 0;

      // Join seller room
      if (this.sellerId) {
        const sellerRoom = `seller_${this.sellerId}`;
        this.socket?.emit('joinRoom', sellerRoom);
        // Backward compatibility for older server handlers.
        this.socket?.emit('join', { room: sellerRoom });
        console.log('[WebSocket] Joined seller room:', `seller_${this.sellerId}`);
      }

      // Trigger connect callbacks
      this.triggerEvent('connect', undefined);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('[WebSocket] Disconnected:', reason);
      this.triggerEvent('disconnect', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('[WebSocket] Connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WebSocket] Max reconnection attempts reached');
        this.triggerEvent('error', { type: 'max_reconnect', message: 'Max reconnection attempts reached' });
      }
    });

    this.socket.on('error', (error: unknown) => {
      console.error('[WebSocket] Error:', error);
      this.triggerEvent('error', error);
    });

    // Order events
    this.socket.on('newOrder', this.handleIncomingNewOrder);
    this.socket.on('newOrderPending', this.handleIncomingNewOrder);

    this.socket.on('orderUpdate', this.handleIncomingOrderUpdate);
    this.socket.on('order:status_updated', this.handleIncomingOrderUpdate);

    this.socket.on('orderAccepted', (data: { order: any }) => {
      console.log('[WebSocket] Order accepted:', data.order._id);
      this.triggerEvent('orderAccepted', data);
    });

    this.socket.on('orderRejected', (data: { order: any; reason: string }) => {
      console.log('[WebSocket] Order rejected:', data.order._id);
      this.triggerEvent('orderRejected', data);
    });

    this.socket.on('orderPreparing', (data: OrderUpdateEvent) => {
      console.log('[WebSocket] Order preparing:', data.orderId);
      this.triggerEvent('orderPreparing', data);
    });

    this.socket.on('orderReady', (data: OrderUpdateEvent) => {
      console.log('[WebSocket] Order ready:', data.orderId);
      this.triggerEvent('orderReady', data);
    });

    this.socket.on('driverAssigned', (data: DriverAssignmentEvent) => {
      console.log('[WebSocket] Driver assigned:', data.orderId, data.driver.name);
      this.triggerEvent('driverAssigned', data);
    });

    this.socket.on('driverArrived', (data: { orderId: string; arrivedAt: string }) => {
      console.log('[WebSocket] Driver arrived:', data.orderId);
      this.triggerEvent('driverArrived', data);
    });

    this.socket.on('orderPickedUp', (data: { orderId: string; pickedUpAt: string }) => {
      console.log('[WebSocket] Order picked up:', data.orderId);
      this.triggerEvent('orderPickedUp', data);
    });

    this.socket.on('driverLocationUpdate', (data: DriverLocationUpdate) => {
      this.triggerEvent('driverLocationUpdate', data);
    });

    this.socket.on('orderDelivered', (data: { orderId: string; deliveredAt: string }) => {
      console.log('[WebSocket] Order delivered:', data.orderId);
      this.triggerEvent('orderDelivered', data);
    });

    // Notification events
    this.socket.on('notification', (data: { title: string; message: string; type: string }) => {
      console.log('[WebSocket] Notification:', data.title);
      this.triggerEvent('notification', data);
    });
  }

  // Subscribe to an event
  on<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    
    this.eventListeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  // Trigger event callbacks
  private triggerEvent<T>(event: string, data: T): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocket] Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Join a specific order room for updates
  joinOrderRoom(orderId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('joinRoom', orderId);
      // Backward compatibility for older server handlers.
      this.socket.emit('join', { room: orderId });
      console.log('[WebSocket] Joined order room:', orderId);
    }
  }

  // Leave an order room
  leaveOrderRoom(orderId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leaveRoom', orderId);
      // Backward compatibility for older server handlers.
      this.socket.emit('leave', { room: orderId });
      console.log('[WebSocket] Left order room:', orderId);
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.sellerId = null;
      console.log('[WebSocket] Disconnected manually');
    }
  }

  // Reconnect with new token
  reconnect(sellerId: string): void {
    this.disconnect();
    this.connect(sellerId);
  }
}

// Singleton instance
export const websocketService = new WebSocketService();

// React Hook for WebSocket events
import { useEffect, useCallback } from 'react';

export function useWebSocketEvent<T>(
  event: string,
  callback: EventCallback<T>,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    const unsubscribe = websocketService.on(event, callback);
    return () => {
      unsubscribe();
    };
  }, [event, ...deps]);
}

// Hook for new orders
export function useNewOrder(callback: (data: NewOrderEvent) => void): void {
  useWebSocketEvent('newOrder', callback);
}

// Hook for order updates
export function useOrderUpdate(callback: (data: OrderUpdateEvent) => void): void {
  useWebSocketEvent('orderUpdate', callback);
}

// Hook for driver assignment
export function useDriverAssigned(callback: (data: DriverAssignmentEvent) => void): void {
  useWebSocketEvent('driverAssigned', callback);
}

// Hook for driver location updates
export function useDriverLocation(callback: (data: DriverLocationUpdate) => void): void {
  useWebSocketEvent('driverLocationUpdate', callback);
}

// Hook for connection status
export function useWebSocketConnection(
  onConnect: () => void,
  onDisconnect: (reason: string) => void
): void {
  useWebSocketEvent('connect', onConnect);
  useWebSocketEvent('disconnect', onDisconnect);
}

export default websocketService;
