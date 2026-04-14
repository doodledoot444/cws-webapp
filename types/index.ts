export type UserRole = 'USER' | 'ADMIN';

export type OrderStatus = 'PENDING' | 'CONFIRMED';

export type NotificationType = 'ORDER_CREATED' | 'ORDER_CONFIRMED' | 'ACCOUNT_VERIFIED';

export interface OrderAddress {
  street: string;
  block: string;
  lot: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  address: OrderAddress;
  quantity: number;
  pricePerUnit: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address: string;
  phone?: string | null;
  isVerified: boolean;
  hasAcceptedPrivacy: boolean;
  emailVerifiedAt?: string | null;
}
