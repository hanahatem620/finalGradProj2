import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

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
                const response = await fetch(`${process.env.API}/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const payload = await response.json();
                console.log("Status:", response.status)
    console.log("Payload:", payload)
    console.log("Email sent:", credentials?.email)

               
                if (!response.ok) {
                    throw new Error(payload.msg || "Invalid credentials");
                }

                if (payload.access_token) {
                    const decoded: {sub : string } = jwtDecode(payload.access_token);

                    
                    return {
                        id: decoded.sub , 
                        role: payload.role,
                        access_token: payload.access_token,
                    };
                }else{
                    throw new Error("invalid email or password");
                }
                
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.access_token = user.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            session.access_token = token.access_token;
            return session;
        }
    }
};