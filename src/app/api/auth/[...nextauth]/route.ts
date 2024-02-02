import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../../../db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID ?? "",
    //   clientSecret: process.env.GITHUB_SECRET ?? "",
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID ?? "",
    //   clientSecret: process.env.GOOGLE_SECRET ?? "",
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password ",
        },
      },
      async authorize(credentials, req) {
        const user = await db
          .selectFrom("users")
          .selectAll()
          .where("email", "=", credentials?.email as any)
          .executeTakeFirst();

        const match = bcrypt.compare(credentials?.password, user?.password);

        if (user && match) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: "",
          };
        } else {
          return null;
          // throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // if (account && user) {
      //   const existingUser = await db
      //     .selectFrom("users")
      //     .select("id")
      //     .where("provider_id", "=", account.providerAccountId)
      //     .executeTakeFirst();

      //   if (!existingUser) {
      //     // User does not exist, insert them into the database
      //     await db
      //       .insertInto("users")
      //       .values({
      //         name: user.name as string,
      //         email: user.email as string,
      //         provider: account.provider,
      //         provider_id: account.providerAccountId,
      //       })
      //       .execute();
      //   }
      // }

      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
