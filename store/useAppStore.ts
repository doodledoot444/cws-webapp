import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppNotification, Order, OrderAddress, OrderStatus, User } from '@/types';

export const PRICE_PER_UNIT = 30;

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface CreateOrderResult {
  success: boolean;
  message: string;
  order?: Order;
}

interface AppState {
  user: User | null;
  orders: Order[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  isAuthenticated: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    address: string
  ) => Promise<AuthResult>;
  resendVerification: () => Promise<{ success: boolean; message: string }>;
  privacyAcceptedByUserId: Record<string, boolean>;
  syncAuthUser: (user: User | null) => void;
  markUserVerified: () => void;
  fetchOrders: (status?: OrderStatus) => Promise<void>;
  createOrder: (address: OrderAddress, quantity: number) => Promise<CreateOrderResult>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  acceptPrivacy: () => void;
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function normalizeStatus(status: string): OrderStatus {
  return status === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING';
}

function normalizeOrder(raw: {
  id: string;
  userId: string;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
  user?: { id: string; email: string; name: string | null };
  address: {
    street?: string;
    block?: string;
    lot?: string;
    notes?: string;
  };
}): Order {
  return {
    id: raw.id,
    userId: raw.userId,
    user: raw.user,
    address: {
      street: String(raw.address?.street || ''),
      block: String(raw.address?.block || ''),
      lot: String(raw.address?.lot || ''),
      ...(raw.address?.notes ? { notes: String(raw.address.notes) } : {}),
    },
    quantity: raw.quantity,
    pricePerUnit: raw.quantity > 0 ? Math.round(raw.total / raw.quantity) : PRICE_PER_UNIT,
    total: raw.total,
    status: normalizeStatus(raw.status),
    createdAt: raw.createdAt,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      notifications: [],
      unreadNotificationsCount: 0,
      isAuthenticated: false,
      privacyAcceptedByUserId: {},

      register: async (
        name: string,
        email: string,
        password: string,
        address: string
      ) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, address }),
          });

          const payload = await readJson(response);
          if (!response.ok) {
            return {
              success: false,
              message: payload.message || 'Registration failed. Please try again.',
            };
          }

          const user = payload.user as User;
          return {
            success: true,
            user,
            message:
              payload.message ||
              'Account created. Sign in and request verification when ready.',
          };
        } catch {
          return {
            success: false,
            message: 'Unable to create your account right now. Please try again.',
          };
        }
      },

      resendVerification: async () => {
        const user = get().user;
        if (!user) {
          return { success: false, message: 'You need to sign in first.' };
        }

        try {
          const response = await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          const payload = await readJson(response);
          return {
            success: response.ok,
            message:
              payload.message ||
              (response.ok
                ? 'A new verification email has been sent.'
                : 'Unable to resend verification email right now.'),
          };
        } catch {
          return {
            success: false,
            message: 'Unable to resend verification email right now.',
          };
        }
      },

      syncAuthUser: (user: User | null) => {
        if (!user) {
          set({ user: null, isAuthenticated: false, orders: [], notifications: [], unreadNotificationsCount: 0 });
          return;
        }

        const accepted = Boolean(get().privacyAcceptedByUserId[user.id]);
        set({
          user: {
            ...user,
            hasAcceptedPrivacy: accepted,
          },
          isAuthenticated: true,
        });
      },

      markUserVerified: () => {
        set((state) => {
          if (!state.user) {
            return state;
          }

          return {
            user: {
              ...state.user,
              isVerified: true,
              emailVerifiedAt: new Date().toISOString(),
            },
          };
        });
      },

      fetchOrders: async (status?: OrderStatus) => {
        try {
          const query = status ? `?status=${status}` : '';
          const response = await fetch(`/api/orders${query}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            return;
          }

          const payload = await readJson(response);
          const orders = Array.isArray(payload.orders)
            ? (payload.orders as Array<Parameters<typeof normalizeOrder>[0]>).map((order) =>
                normalizeOrder(order)
              )
            : [];

          set({ orders });
        } catch {
          // ignore transient polling errors
        }
      },

      createOrder: async (address: OrderAddress, quantity: number) => {
        try {
          const total = quantity * PRICE_PER_UNIT;
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address,
              quantity,
              total,
            }),
          });

          const payload = await readJson(response);
          if (!response.ok || !payload.order) {
            return {
              success: false,
              message: payload.message || 'Unable to place order right now.',
            };
          }

          const order = normalizeOrder(payload.order);
          set((state) => ({ orders: [order, ...state.orders] }));
          return {
            success: true,
            message: 'Order created successfully.',
            order,
          };
        } catch {
          return {
            success: false,
            message: 'Unable to place order right now.',
          };
        }
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      fetchNotifications: async () => {
        try {
          const response = await fetch('/api/notifications', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            return;
          }

          const payload = await readJson(response);
          set({
            notifications: Array.isArray(payload.notifications)
              ? (payload.notifications as AppNotification[])
              : [],
            unreadNotificationsCount: Number(payload.unreadCount || 0),
          });
        } catch {
          // ignore transient polling errors
        }
      },

      markNotificationAsRead: async (notificationId: string) => {
        const previous = get().notifications;
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          ),
          unreadNotificationsCount: Math.max(
            0,
            state.unreadNotificationsCount -
              (state.notifications.find((n) => n.id === notificationId && !n.isRead)
                ? 1
                : 0)
          ),
        }));

        try {
          const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            set({ notifications: previous });
            const unread = previous.reduce(
              (count, notification) => count + (notification.isRead ? 0 : 1),
              0
            );
            set({ unreadNotificationsCount: unread });
          }
        } catch {
          set({ notifications: previous });
          const unread = previous.reduce(
            (count, notification) => count + (notification.isRead ? 0 : 1),
            0
          );
          set({ unreadNotificationsCount: unread });
        }
      },

      acceptPrivacy: () => {
        set((state) => {
          if (!state.user) {
            return state;
          }

          return {
            privacyAcceptedByUserId: {
              ...state.privacyAcceptedByUserId,
              [state.user.id]: true,
            },
            user: {
              ...state.user,
              hasAcceptedPrivacy: true,
            },
          };
        });
      },
    }),
    {
      name: 'ceris-tracking-store',
      version: 3,
      partialize: (state) => ({
        privacyAcceptedByUserId: state.privacyAcceptedByUserId,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState> & {
          user?: Partial<User> | null;
          privacyAcceptedByUserId?: Record<string, boolean>;
        };

        const legacyUser = state.user;
        const migratedUser = legacyUser
          ? {
              id: String(legacyUser.id || ''),
              email: String(legacyUser.email || ''),
              name: String(legacyUser.name || ''),
              role: legacyUser.role === 'ADMIN' ? 'ADMIN' : 'USER',
              address: String(legacyUser.address || ''),
              phone: legacyUser.phone ?? null,
              isVerified: Boolean(legacyUser.isVerified),
              hasAcceptedPrivacy: Boolean(legacyUser.hasAcceptedPrivacy),
              emailVerifiedAt: legacyUser.emailVerifiedAt ?? null,
            }
          : null;

        return {
          user: null,
          orders: [],
          notifications: [],
          unreadNotificationsCount: 0,
          isAuthenticated: false,
          privacyAcceptedByUserId:
            state.privacyAcceptedByUserId ??
            (migratedUser
              ? { [migratedUser.id]: Boolean(migratedUser.hasAcceptedPrivacy) }
              : {}),
        };
      },
    }
  )
);
