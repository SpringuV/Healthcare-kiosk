// services/user.service.ts → chỉ gọi API user
import axios from "axios";

// LoginForm → dispatch loginThunk
// loginThunk → gọi loginUser (service)
// loginUser → gọi API (post), validate dữ liệu
// authSlice → lắng nghe thunk, update state (user, token, error, loading)
// LoginForm → dựa vào state để render loading/error hoặc redirect
export const loginUser = async (values: LoginAccountType) => {
    const res = await axios.post<LoginResponseType>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, values);

    // Fix: Backend trả về _id và role riêng biệt, không có field user
    if (!res.data.token_type || !res?.data?.access_token) {
        throw new Error("Invalid response from server");
    }

    return res;
};

export const refreshToken = async (refresh_token: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`,
        {
            refresh_token, // gửi đúng field mà backend nhận
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    if (!res?.data?.expires_in || !res?.data?.access_token) {
        throw new Error("Refresh token failed");
    }
    return res;
}

export const adminDashboardInfo = async (accessToken: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/admin/get_dashboard_info`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
    return res
}

// loginUser sử dụng post() (Axios wrapper) để gọi backend /api/login.
// Nếu response không hợp lệ (không có token_type hoặc user), throw error → bị catch trong loginThunk.
// Nếu hợp lệ, trả về toàn bộ response.