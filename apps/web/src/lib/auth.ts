import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createDb, schema } from "@subtracker/db/client";

const isDev = process.env.NODE_ENV === "development";

const devProviders = [
  Credentials({
    name: "Dev Login",
    credentials: {
      email: { label: "Email", type: "email", value: "dev@subtracker.app" },
    },
    async authorize(credentials) {
      return {
        id: "dev-user-1",
        name: "Dev User",
        email: (credentials?.email as string) || "dev@subtracker.app",
        image: null,
      };
    },
  }),
];

const prodProviders = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  }),
];

function createAdapter() {
  if (isDev || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dummy")) {
    return undefined;
  }
  const db = createDb(process.env.DATABASE_URL);
  return DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  });
}

const hasAdapter = !isDev && !!process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("dummy");

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: createAdapter(),
  session: { strategy: hasAdapter ? ("database" as const) : ("jwt" as const) },
  providers: isDev ? devProviders : prodProviders,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = (token?.id as string) ?? user?.id;
      }
      return session;
    },
  },
});
