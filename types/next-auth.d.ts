import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id?: string;
    isVerified?: boolean;
    address?: string | null;
    phone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      isVerified: boolean;
      address?: string | null;
      phone?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    address?: string | null;
    phone?: string | null;
  }
}
