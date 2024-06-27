import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {},
        async authorize(credentials): Promise<any> {
          if (!credentials) return null;
  
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
  
          const user = await prisma.user.findUnique({
            where: { email },
          });
  
          if (
            user &&
            user.password !== null &&
            (await compare(password, user.password))
          ) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.image,
              // userCart: user.userCart,
            };
          } else {
            throw new Error("Invalid email or password!");
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        profile(profile): any {
          return {
            id: profile.sub,
            name: `${profile.given_name} ${profile.family_name}`,
            email: profile.email,
            image: profile.picture,
          };
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      },
      session: async ({ session, token }) => {
        if (session.user) {
          session.user.id = token.id;
          session.user.role = token.role;
          session.user.image = token.picture;
          // session.user.userCart = token.userCart;
        }
        return session;
      },
      async redirect({ baseUrl }) {
        return `${baseUrl}/profile`;
      },
    },
  };