import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/lib/db';
import { verifyWerkzeugHash } from '@/lib/password';

// Dev bootstrap admin — mirrors the original Flask EMPLOYEES entry so a
// fresh SQLite file always has an immediately-usable Manager login.
const HARDCODED_ADMIN = {
    email: 'admin@glamngo.com',
    password: 'admin123',
    id: '0',
    role: 'admin',
    name: 'Admin',
};

export const authOptions: NextAuthOptions = {
    pages: { signIn: "/LogIn" },
    session: { strategy: 'jwt' },

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                const email = (credentials?.email || '').toString().trim().toLowerCase();
                const password = (credentials?.password || '').toString();

                if (email === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
                    return {
                        id: HARDCODED_ADMIN.id,
                        role: HARDCODED_ADMIN.role,
                        name: HARDCODED_ADMIN.name,
                        email,
                    } as any;
                }

                const user = getUserByEmail(email);
                if (!user) throw new Error('Invalid email or password');
                if (!verifyWerkzeugHash(password, user.password_hash)) {
                    throw new Error('Invalid email or password');
                }
                if (user.status !== 'ACTIVE') {
                    throw new Error('Account suspended — contact support');
                }

                return {
                    id: String(user.id),
                    role: (user.role || '').toLowerCase(),
                    name: user.p_name || email.split('@')[0],
                    email: user.email,
                } as any;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        }
    }
};
