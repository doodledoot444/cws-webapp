export type OrderStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed';

export interface OrderAddress {
  street: string;
  block: string;
  lot: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  address: OrderAddress;
  quantity: number;
  pricePerUnit: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string | null;
  isVerified: boolean;
  hasAcceptedPrivacy: boolean;
  emailVerifiedAt?: string | null;
}
