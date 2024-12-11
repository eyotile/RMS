import React, { useEffect } from 'react';
import { OrderList } from '../components/kitchen/order-list';
import { StatusFilter } from '../components/kitchen/status-filter';
import { useKitchenStore } from '../store/kitchen.store';
import { KitchenOrder, OrderStatus } from '../types/kitchen';

// Sample data - In a real app, this would come from an API
const SAMPLE_ORDERS: KitchenOrder[] = [
  {
    id: '1',
    items: [
      { name: 'Margherita Pizza', quantity: 2 },
      { name: 'Garlic Bread', quantity: 1 },
    ],
    status: 'pending',
    tableNumber: 5,
    priority: 'high',
    orderTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: '2',
    items: [
      { name: 'Classic Burger', quantity: 1 },
      { name: 'French Fries', quantity: 1 },
    ],
    status: 'preparing',
    tableNumber: 3,
    priority: 'normal',
    orderTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
];

export function KitchenPage() {
  const { orders, filter, setFilter } = useKitchenStore();

  useEffect(() => {
    // In a real app, this would be replaced with an API call
    useKitchenStore.setState({ orders: SAMPLE_ORDERS });
  }, []);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    useKitchenStore.setState((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    }));
  };

  const filteredOrders = orders.filter(
    (order) => filter === 'all' || order.status === filter
  );

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-900 mb-6">Kitchen Display</h1>
      
      <StatusFilter
        currentFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />
      
      <OrderList
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}