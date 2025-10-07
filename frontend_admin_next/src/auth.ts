/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth"
import type { User } from "next-auth"
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
                    if (responseData && responseData.access_token && responseData.session_id) {
                        return {
                            // user
                            id: responseData.user.id,
                            email: responseData.user.email,
                            isVerify: responseData.user.isVerify,
                            type: responseData.user.type,
                            role: responseData.user.role,
                            realname: responseData.user.realname,
                            username: responseData.user.username,

                            // token
                            refresh_token: responseData.refresh_token,
                            refresh_expires_in: responseData.refresh_expires_in,
                            message: responseData.message,
                            access_token: responseData.access_token,
                            token_type: responseData.token_type,
                            expires_in: responseData.expires_in,
                            session_id: responseData.session_id,
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
                token.user = {
                    id: user.id,
                    email: user.email,
                    isVerify: (user as any).isVerify,
                    type: (user as any).type,
                    role: (user as any).role,
                    realname: (user as any).realname,
                    username: (user as any).username,
                } as IUser;
                token.access_token = (user as any).access_token
                token.refresh_token = (user as any).refresh_token
                token.refresh_expires_in = (user as any).refresh_expires_in
                token.token_type = (user as any).token_type
                token.expires_in = (user as any).expires_in
                token.session_id = (user as any).session_id
                token.access_exp = Date.now() + Number((user as any).expires_in) * 1000
            }
            // Nếu access token còn hạn thì trả về luôn
            if (Date.now() < (token.access_exp as number)) {
                return token;
            }
            try {
                if (!token.refresh_token) throw new Error("Missing refresh_token");
                const res = await refreshToken(token.refresh_token);
                token.access_token = res.data.access_token;
                token.expires_in = res.data.expires_in;
                token.access_exp = Date.now() + res.data.expires_in * 1000;
                return token;
            } catch (err: any) {
                console.error("Failed to refresh access token:", err.message);
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },

        session({ session, token }) {
            (session.user as IUser) = token.user
            session.access_token = token.access_token as string
            session.token_type = token.token_type as string
            session.expires_in = token.expires_in as number
            session.session_id = token.session_id as string
            session.refresh_token = token.refresh_token as string
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