
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret,
    session: {
        strategy: "jwt",
    },

    jwt: {
        async encode({ secret, token }) {
            return jwt.sign(token!, secret, { algorithm: "HS256" });
        },
        async decode({ secret, token }) {
            return jwt.verify(token!, secret, { algorithms: ["HS256"] }) as any;
        },
    },
    callbacks: {
        async session({ session, token }) {
            // Re-sign the token payload to create a valid JWT string for the backend
            const encodedToken = jwt.sign(token, secret!, { algorithm: "HS256" });
            (session as any).accessToken = encodedToken;
            return session;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.id = user.id;
            }
            return token;
        }
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
