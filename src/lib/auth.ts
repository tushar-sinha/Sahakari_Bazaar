import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  pages: {
    signIn: "/signin",
    error: "/auth/error"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Find user by email
          const user = await prisma.customer.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            return null
          }

          // Return a user object (without password)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
          }
        } catch (error) {
          console.error("Error in authorize:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      try {
        if (user) {
          token.id = user.id
          token.mobile = user.mobile
          token.name = user.name
          token.email = user.email
        }
        return token
      } catch (error) {
        console.error("Error in jwt callback:", error)
        return token
      }
    },
    async session({ session, token }: any) {
      try {
        if (session.user) {
          session.user.id = token.id as string
          session.user.name = token.name
          session.user.email = token.email
          ;(session.user as any).mobile = token.mobile
        }
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    }
  }
}