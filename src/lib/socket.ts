import { io, Socket } from 'socket.io-client';
import { Order } from '../types/order';
import { KitchenOrder } from '../types/kitchen';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string) {
    this.socket = io('http://localhost:3001', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  subscribeToOrders(callback: (order: Order) => void) {
    this.socket?.on('new_order', callback);
  }

  subscribeToKitchenUpdates(callback: (order: KitchenOrder) => void) {
    this.socket?.on('kitchen_update', callback);
  }

  updateOrderStatus(orderId: string, status: string) {
    this.socket?.emit('update_order_status', { orderId, status });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = SocketService.getInstance();