/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginAccountType, LoginResponseData } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { loginUser } from "@/services/user.service";

export const loginThunk = createAsyncThunk<
    LoginResponseData,          // return type
    LoginAccountType,           // argument type
    { state: RootState }        // thunkAPI type
>(
    "auth/login",
    async (values, thunkAPI) => {
        try {
            const res = await loginUser(values);
            return res.data;
        } catch (err: any) {
            // Kiểm tra response từ server, nếu có lỗi thì trả về rejectWithValue
            console.log(err.response)
            const errorMsg = err.response?.data?.detail || err.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

// loginThunk nhận username + password, gọi loginUser() (service) để thực hiện request.
// Nếu API thành công, trả về dữ liệu res.data → fulfilled.
// Nếu API lỗi, dùng thunkAPI.rejectWithValue(errorMsg) → rejected.