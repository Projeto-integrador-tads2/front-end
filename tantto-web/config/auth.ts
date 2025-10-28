import { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { Login } from "@/services/auth/login";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Informe as credenciais.");
        const response = await Login({
          email: credentials.email,
          password: credentials.password,
        });

        console.log("data",response.data)

        let user = null;

        if (response.data.success) {
          user = {
            ...response.data.data.user,
            access_token: response.data.data.access_token,
          };

          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;

        token = {
          ...token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            isAffiliate: user.isAffiliate,
            Role: user.Role,
          },
          access_token: u.access_token,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = { ...token.user };
      session.access_token = token.access_token;

      return session;
    },
  },
};

export default nextAuthOptions;
