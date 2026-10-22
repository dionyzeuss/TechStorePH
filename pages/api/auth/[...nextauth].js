// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const secret = process.env.NEXTAUTH_SECRET;
console.log('NEXTAUTH_SECRET in [...nextauth].js:', secret);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Fetch user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if the user exists and the password matches
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // Only include id and email in the session (you can add more if needed)
          return { id: user.id, email: user.email };
        }

        // Return null if authentication fails
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: secret, // Use the local variable
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to the token
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session object
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});