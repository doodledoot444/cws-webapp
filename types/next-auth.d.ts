import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: 'USER' | 'ADMIN';
    isVerified?: boolean;
    address?: string | null;
    phone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: 'USER' | 'ADMIN';
      isVerified: boolean;
      address?: string | null;
      phone?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'USER' | 'ADMIN';
    isVerified?: boolean;
    address?: string | null;
    phone?: string | null;
  }
}
