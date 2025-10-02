import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"

interface IUser {
    _id: string
    username?: string
    role: string
}
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: string
        role: string
        accessToken: string
        refreshToken?: string
        accessExpire: number
        expiresIn: number
        error?: string
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: IUser
        accessToken: string
        refreshToken?: string
        accessExpire: number
        expiresIn: number
        error?: string
    }
}


