import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Order, OrderStatus, OrderAddress } from '@/types';

export const PRICE_PER_UNIT = 30;

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AppState {
  user: User | null;
  orders: Order[];
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
  createOrder: (address: OrderAddress, quantity: number) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  acceptPrivacy: () => void;
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
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
              'Account created. Please check your email to verify your account.',
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
          set({ user: null, isAuthenticated: false });
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

      createOrder: (address: OrderAddress, quantity: number): Order => {
        const user = get().user;
        const order: Order = {
          id: `order-${Date.now()}`,
          userId: user?.id ?? '',
          address,
          quantity,
          pricePerUnit: PRICE_PER_UNIT,
          total: quantity * PRICE_PER_UNIT,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
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
      version: 2,
      partialize: (state) => ({
        orders: state.orders,
        privacyAcceptedByUserId: state.privacyAcceptedByUserId,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState> & {
          user?: Partial<User> | null;
          orders?: Order[];
          isAuthenticated?: boolean;
          privacyAcceptedByUserId?: Record<string, boolean>;
        };

        const legacyUser = state.user;
        const migratedUser = legacyUser
          ? {
              id: String(legacyUser.id || ''),
              email: String(legacyUser.email || ''),
              name: String(legacyUser.name || ''),
              address: String(legacyUser.address || ''),
              phone: legacyUser.phone ?? null,
              isVerified: Boolean(legacyUser.isVerified),
              hasAcceptedPrivacy: Boolean(legacyUser.hasAcceptedPrivacy),
              emailVerifiedAt: legacyUser.emailVerifiedAt ?? null,
            }
          : null;

        return {
          user: null,
          orders: state.orders ?? [],
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
