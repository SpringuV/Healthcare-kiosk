import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { AccountBeingUsedError, AccountLockedError, AccountNotFoundError, InvalidEmailPasswordError } from "./utils/errors"
import axios from "axios"
import { loginUser, refreshToken } from "./services/user.service"
import { IUser } from "./types/next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    const res = await loginUser({
                        username: credentials.username as string,
                        password: credentials.password as string,
                    })
                    const responseData = res.data
                    if (responseData && responseData.access_token) {
                        return {
                            _id: responseData.id, // dùng cho session / redux
                            id: responseData.id,              // NextAuth yêu cầu có field id
                            role: responseData.role,
                            accessToken: responseData.access_token,
                            expiresIn: responseData.expires_in,
                        }
                    }
                    return null;
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        const status = err.response?.status;
                        switch (status) {
                            case 400: throw new InvalidEmailPasswordError();
                            case 403: throw new AccountBeingUsedError();
                            case 497: throw new AccountLockedError();
                            case 404: throw new AccountNotFoundError();
                        }
                    }
                    throw err;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            // console.log("token: ", token)
            // Khi login lần đầu
            if (user) {
                token.user = user as IUser
            }
            // Nếu access token còn hạn thì trả về luôn
            if (Date.now() < (token.exp as number)) {
                return token;
            } else {
                // Nếu hết hạn → gọi API refresh
                try {
                    const res = await refreshToken();
                    token.accessExpire = Date.now() + res.data.expires_in * 1000;
                    token.accessToken = res.data.access_token
                } catch (err) {
                    return { ...token, error: "RefreshAccessTokenError" };
                }
            }
            return token
        },

        session({ session, token }) {
            (session.user as IUser) = token.user
            session.accessExpire = token.accessExpire
            session.error = token.error
            return session
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated
            // otherwise redirect to login page
            return !!auth
        }
    },
    debug: true,
})