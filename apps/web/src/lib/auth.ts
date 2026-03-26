import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

const isDev = process.env.NODE_ENV === "development";

// In dev mode: use JWT sessions + Credentials (no DB needed)
// In prod mode: use Drizzle adapter + OAuth providers
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Skip DB adapter in dev (Credentials provider requires JWT strategy)
  ...(isDev
    ? { session: { strategy: "jwt" as const } }
    : {
        adapter: undefined, // TODO: DrizzleAdapter when DB is ready
      }),
  providers: isDev ? devProviders : prodProviders,
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
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
