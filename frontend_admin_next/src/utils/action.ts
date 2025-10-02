/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
    try {
        const res = await signIn("credentials", {
            username: username,
            password: password,
            // callbackUrl: "/",  
            redirect: false,
        })

        // Nếu NextAuth trả về lỗi
        if (res?.error) {
            switch (res.error) {
                case "InvalidEmailPasswordError":
                    return { error: "Sai mật khẩu hoặc tài khoản không tồn tại", code: 1 }
                case "InactiveAccountError":
                    return { error: "Tài khoản bị khóa hoặc chưa kích hoạt", code: 2 }
                default:
                    return { error: res.error, code: 0 }
            }
        }
        return res
    } catch (error) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }
        } else if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        } else {
            return {
                error: "Internal server error",
                code: 0
            }
        }
    }
}