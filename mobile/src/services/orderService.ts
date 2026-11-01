import { POBOrder, CartItem, Product } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncService } from './sync/syncService';
import { PRODUCTS_MOCK, CURRENT_USER } from '../constants/mockData';
import { AuthService } from './authService';
import { SupabaseDbService } from './supabase/supabaseDbService';

export class OrderService {
  public static async getProducts(): Promise<Product[]> {
    const cached = await StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS_CACHE, []);
    const isLegacy = cached && cached.length > 0 && cached.some(p => p.id === 'prod-01' || p.brandName.includes('CardioPulse'));
    if (cached && cached.length > 0 && !isLegacy) return cached;

    await StorageService.setItem(STORAGE_KEYS.PRODUCTS_CACHE, PRODUCTS_MOCK);
    return PRODUCTS_MOCK;
  }

  public static async getOrders(): Promise<POBOrder[]> {
    if (SupabaseDbService.isConnected()) {
      try {
        const cloudOrders = await SupabaseDbService.fetchOrders();
        if (cloudOrders && cloudOrders.length > 0) return cloudOrders;
      } catch (e) {}
    }
    return await StorageService.getItem<POBOrder[]>(STORAGE_KEYS.ORDERS_LOCAL, []);
  }

  public static async createOrder(orderData: {
    buyerType: 'CHEMIST' | 'STOCKIST';
    buyerId: string;
    buyerName: string;
    stockistName: string;
    territory: string;
    items: CartItem[];
    remarks?: string;
    latitude: number;
    longitude: number;
  }): Promise<POBOrder> {
    let subTotal = 0;
    let gstAmount = 0;

    orderData.items.forEach(item => {
      subTotal += item.itemTotal;
      const rate = item.product.gstRate ?? 5;
      gstAmount += (item.itemTotal * rate) / 100;
    });

    const currentUser = AuthService.getCurrentUser() || CURRENT_USER;

    const newOrder: POBOrder = {
      id: `pob_${Date.now()}`,
      orderNumber: `POB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeId: currentUser?.id || 'usr-mr-01',
      employeeName: currentUser?.name || 'Field Representative',
      buyerType: orderData.buyerType,
      buyerId: orderData.buyerId,
      buyerName: orderData.buyerName,
      stockistName: orderData.stockistName,
      territory: orderData.territory,
      orderDate: new Date().toISOString().split('T')[0],
      items: orderData.items,
      subTotal: Math.round(subTotal * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      grandTotal: Math.round((subTotal + gstAmount) * 100) / 100,
      remarks: orderData.remarks,
      latitude: orderData.latitude,
      longitude: orderData.longitude,
      status: 'BOOKED',
      syncStatus: 'PENDING'
    };

    const orders = await this.getOrders();
    orders.unshift(newOrder);
    await StorageService.setItem(STORAGE_KEYS.ORDERS_LOCAL, orders);

    // Queue for sync
    await SyncService.enqueue('POB_ORDER', newOrder);

    return newOrder;
  }
}
