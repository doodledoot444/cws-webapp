import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { User as PrismaUser } from '@prisma/client';
import type { User } from '@/types';

const VERIFICATION_TOKEN_TTL_MS = 15 * 60 * 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function getVerificationTokenExpiry() {
  return new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
}

export function isValidEmail(email: string) {
  if (!email) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254) {
    return false;
  }

  return EMAIL_REGEX.test(normalized);
}

export function toClientUser(user: PrismaUser): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? '',
    phone: user.phone,
    address: user.address ?? '',
    isVerified: user.isVerified,
    hasAcceptedPrivacy: false,
    emailVerifiedAt: user.emailVerified?.toISOString() ?? null,
  };
}
