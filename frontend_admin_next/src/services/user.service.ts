// services/user.service.ts → chỉ gọi API user
import { LoginAccountType, LoginResponseData, LoginResponseType } from "@/types/auth";
import { post } from "./api";

// LoginForm → dispatch loginThunk
// loginThunk → gọi loginUser (service)
// loginUser → gọi API (post), validate dữ liệu
// authSlice → lắng nghe thunk, update state (user, token, error, loading)
// LoginForm → dựa vào state để render loading/error hoặc redirect
export const loginUser = async (values: LoginAccountType): Promise<LoginResponseType> => {
    const res = await post<LoginResponseData>("/api/login", values);
    
    // Fix: Backend trả về _id và role riêng biệt, không có field user
    if (!res.data.token_type || !res?.data?._id) {
        throw new Error("Invalid response from server");
    }
    
    return res;
};

// loginUser sử dụng post() (Axios wrapper) để gọi backend /api/login.
// Nếu response không hợp lệ (không có token_type hoặc user), throw error → bị catch trong loginThunk.
// Nếu hợp lệ, trả về toàn bộ response.