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
        try {
          if (!credentials) {
            console.error("❌ Credenciais não fornecidas");
            throw new Error("Informe as credenciais.");
          }

          const response = await Login({
            email: credentials.email,
            password: credentials.password,
          });


          if (response.data) {
            const { token, userId, name, email, role, message } = response.data;

            const user = {
              id: userId,
              userId,
              name,
              email,
              role,
              token,
              message,
            };

            return user;
          }

          return null;
        } catch (error: any) {
          console.error("❌ Erro no authorize:", error);
          console.error("❌ Detalhes do erro:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.user.id,
        name: token.user.name,
        email: token.user.email,
        role: token.user.role,
      };
      session.token = token.token;

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default nextAuthOptions;
