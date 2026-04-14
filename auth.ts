import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getPrisma } from '@/lib/prisma';
import { isValidEmail, verifyPassword } from '@/lib/auth';

// Lazy singleton — getPrisma() must not be called at module scope on Vercel
// because DATABASE_URL is only available at request runtime, not during module init.
let _prisma: ReturnType<typeof getPrisma> | null = null;
function lazyPrisma() {
  if (!_prisma) _prisma = getPrisma();
  return _prisma;
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const prisma = lazyPrisma();
  return {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    trustHost: true,
    useSecureCookies: process.env.NODE_ENV === 'production',
    providers: [
      Credentials({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          const email = String(credentials?.email || '').trim().toLowerCase();
          const password = String(credentials?.password || '');

          if (!email || !password || !isValidEmail(email)) {
            return null;
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            return null;
          }

          const validPassword = await verifyPassword(password, user.passwordHash);
          if (!validPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            address: user.address,
            phone: user.phone,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        if (user) {
          token.id = user.id;
          token.role = user.role ?? 'USER';
          token.isVerified = Boolean(user.isVerified);
          token.address = user.address ?? null;
          token.phone = user.phone ?? null;
        }

        if (trigger === 'update' && session?.user) {
          token.name = session.user.name ?? token.name;
          token.isVerified = Boolean(session.user.isVerified);
          token.address = session.user.address ?? null;
          token.phone = session.user.phone ?? null;
        }

        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: String(token.id) },
            select: {
              email: true,
              name: true,
              role: true,
              isVerified: true,
              address: true,
              phone: true,
            },
          });

          if (dbUser) {
            token.email = dbUser.email;
            token.name = dbUser.name ?? token.name;
            token.role = dbUser.role;
            token.isVerified = dbUser.isVerified;
            token.address = dbUser.address ?? null;
            token.phone = dbUser.phone ?? null;
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (!session.user) {
          return session;
        }

        session.user.id = String(token.id || '');
        session.user.email = String(token.email || session.user.email || '');
        session.user.name = token.name ? String(token.name) : null;
        session.user.role = token.role === 'ADMIN' ? 'ADMIN' : 'USER';
        session.user.isVerified = Boolean(token.isVerified);
        session.user.address = token.address ? String(token.address) : null;
        session.user.phone = token.phone ? String(token.phone) : null;

        return session;
      },
    },
    pages: {
      signIn: '/',
      signOut: '/',
    },
  };
});
