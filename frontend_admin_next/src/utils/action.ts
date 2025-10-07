/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { signIn } from "@/auth";

type AuthResult =
    | { success: true;[key: string]: any }
    | { error: string; code: number }

const errorMap: Record<string, { error: string; code: number }> = {
    InvalidEmailPasswordError: { error: "Incorrect email or password", code: 1 },
    AccountBeingUsedError: { error: "Account is already being used", code: 2 },
    AccountLockedError: { error: "Your account is locked", code: 3 },
    AccountNotFoundError: { error: "Account not found", code: 4 },
}

export async function authenticate(username: string, password: string): Promise<AuthResult> {
    const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
    })
    if (!res || res.error) {
        return errorMap[res.error] ?? { error: "Lỗi khi đăng nhập", code: 0 }
    }

    // thành công
    return { success: true, ...res }
}