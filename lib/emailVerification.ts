import type { User as PrismaUser } from '@prisma/client';
import { getPrisma } from '@/lib/prisma';
import { generateVerificationToken, getVerificationTokenExpiry } from '@/lib/auth';

export type VerifyEmailTokenResult =
  | { success: true; user: PrismaUser }
  | { success: false; reason: 'invalid' | 'expired' | 'already-verified' };

export type ResolveVerificationTokenResult =
  | {
      success: true;
      token: string;
      reused: boolean;
      user: Pick<PrismaUser, 'id' | 'email' | 'name'>;
    }
  | { success: false; reason: 'user-not-found' | 'already-verified' };

export async function verifyEmailToken(token: string): Promise<VerifyEmailTokenResult> {
  const prisma = getPrisma();
  const now = new Date();

  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken) {
    return { success: false, reason: 'invalid' };
  }

  if (verificationToken.user.isVerified) {
    return { success: false, reason: 'already-verified' };
  }

  if (verificationToken.expiresAt < now) {
    return { success: false, reason: 'expired' };
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: verificationToken.userId },
      data: {
        isVerified: true,
        emailVerified: now,
      },
    });

    await tx.notification.create({
      data: {
        userId: verificationToken.userId,
        type: 'ACCOUNT_VERIFIED',
        message:
          'Your Account has been Verified. Thank you for choosing Ceris Water Station. You can now place an order.',
      },
    });

    
    await tx.emailVerificationToken.delete({ where: { id: verificationToken.id } });

    return user;
  });

  return { success: true, user: updatedUser };
}

export async function resolveVerificationTokenForUser(
  userId: string
): Promise<ResolveVerificationTokenResult> {
  const prisma = getPrisma();
  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      isVerified: true,
    },
  });

  if (!user) {
    return { success: false, reason: 'user-not-found' };
  }

  if (user.isVerified) {
    return { success: false, reason: 'already-verified' };
  }

  const existingTokens = await prisma.emailVerificationToken.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const reusableToken = existingTokens.find((entry) => entry.expiresAt > now);
  if (reusableToken) {
    return {
      success: true,
      token: reusableToken.token,
      reused: true,
      user,
    };
  }

  const token = generateVerificationToken();
  const expiresAt = getVerificationTokenExpiry();

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    }),
  ]);

  return {
    success: true,
    token,
    reused: false,
    user,
  };
}
