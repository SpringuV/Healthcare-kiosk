import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"

export interface IUser {
    id: string;
    username: string;
    email: string;
    realname: string;
    isVerify: boolean; 
    type: string;
    role: string;
}

// JWT lưu ở cookie (server side)
declare module "next-auth/jwt" {
    interface JWT {
        user: IUser;
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
        refresh_expires_in: number;  // Đổi từ string sang number
        session_id: string;
        access_exp?: number; // thời gian hết hạn access_token (timestamp)
        error?: string;
    }
}

// Session trả về client (client side)
declare module "next-auth" {
    interface Session {
        user: IUser;
        access_token: string;
        token_type: string;
        expires_in: number;
        session_id: string;
        refresh_token: string;
        error?: string;
    }
}
