import { redirect } from 'next/navigation';
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';
import { compare } from 'bcryptjs';
import { createHash } from 'node:crypto';
import { db } from './db';
import { limit, HttpError } from './security';
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Administrator',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials.password ||
          credentials.email.length > 254 ||
          new TextEncoder().encode(credentials.password).length > 72
        )
          return null;
        const email = credentials.email.trim().toLowerCase();
        try {
          await limit(
            `login:${createHash('sha256').update(email).digest('hex')}`,
            10,
            15 * 60 * 1000,
          );
          await limit('login:global', 100, 15 * 60 * 1000);
        } catch {
          return null;
        }
        const user = await db.user.findUnique({ where: { email } });
        // Always perform a password comparison, including unknown accounts.
        const valid = await compare(
          credentials.password,
          user?.passwordHash ?? '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW',
        );
        if (!user?.active || user.role !== 'ADMIN' || !valid) return null;
        return { id: user.id, email: user.email, name: user.name, version: user.sessionVersion };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.version = (user as unknown as { version: number }).version;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, { id: token.id, version: token.version });
      }
      return session;
    },
  },
};
export async function currentAdmin() {
  const session = await getServerSession(authOptions);
  const identity = session?.user as { id?: string; version?: number } | undefined;
  if (!identity?.id) return null;
  const user = await db.user.findUnique({ where: { id: identity.id } });
  return user?.active && user.role === 'ADMIN' && user.sessionVersion === identity.version
    ? user
    : null;
}
export async function requireAdmin() {
  const user = await currentAdmin();
  if (!user) throw new HttpError(401, 'Administrator access required');
  return user;
}

export async function requireAdminPage() {
  const user = await currentAdmin();
  if (!user) redirect('/login');
  return user;
}
