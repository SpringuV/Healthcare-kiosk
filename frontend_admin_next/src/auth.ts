/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { AccountBeingUsedError, AccountLockedError, AccountNotFoundError, InvalidEmailPasswordError } from "./utils/errors"
import axios from "axios"
import { refreshToken } from "./services/user.service"

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
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
                        username: credentials?.username,
                        password: credentials?.password,
                    })
                    console.log("Backend response status:", res.status);
                    console.log("Backend response data:", JSON.stringify(res.data, null, 2));
                    const responseData = res.data
                    console.log(">>> check res login: ", res)
                    // Check if we have the expected structure
                    if (responseData && responseData.access_token) {
                        return {
                            id: responseData._id,              // NextAuth yêu cầu có field id
                            role: responseData.role,           // custom field
                            accessToken: responseData.access_token,
                            expiresIn: responseData.expires_in,
                            refreshToken: responseData.refreshToken
                        }
                    }

                    console.log("FAILED: Invalid response structure - missing access_token or user");
                    console.log("Response was:", responseData);
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
            // Khi login lần đầu
            if (user) {
                token.id = (user as any).id
                token.role = (user as any).role
                token.accessToken = (user as any).accessToken
                token.refreshToken = (user as any).re
                token.expiresIn = (user as any).expiresIn as number
                token.accessTokenExpires = Date.now() + (user as any).expiresIn * 1000
            }
            // Nếu access token còn hạn thì trả về luôn
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }
            // Nếu hết hạn → gọi API refresh
            try {
                const res = await refreshToken();

                token.accessToken = res.data.access_token;
                token.expiresIn = res.data.expires_in;
                token.accessTokenExpires = Date.now() + res.data.expires_in * 1000;
            } catch (err) {
                console.error("Refresh token failed", err);
                return { ...token, error: "RefreshAccessTokenError" };
            }

            return token
        },

        session({ session, token }) {
            session.user = {
                id: token.id,
                _id: token.id,
                role: token.role,
                username: (token as any).username,
                email: (token as any).email ?? "",
                emailVerified: (token as any).emailVerified ?? null,
            }
            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken
            session.accessExpire = token.accessExpire
            session.expiresIn = token.expiresIn
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