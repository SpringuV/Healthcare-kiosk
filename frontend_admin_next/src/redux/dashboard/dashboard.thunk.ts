/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDashboardInfo, refreshToken } from "@/services/user.service"
import { AppDispatch } from "../store"
import { loadDashboardInfo_Fail, loadDashboardInfo_Start, loadDashboardInfo_Success } from "./dashboard.slice"
import axios from "axios"

export const fetchDashBoard = (token: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(loadDashboardInfo_Start())
        try {
            const res = await adminDashboardInfo(token)
            if (res.status == 200) {
                dispatch(loadDashboardInfo_Success(res.data))
            } else if (res.status == 499) {
                
            } else {
                dispatch(
                    loadDashboardInfo_Fail(`Lỗi API (${res.status}): ${res.data.detail}`)
                );
            }
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const message =
                    err.response?.data?.message ||
                    err.message ||
                    "Lỗi không xác định từ server";

                // Gửi cả mã lỗi và message vào Redux
                dispatch(loadDashboardInfo_Fail(`Mã lỗi ${status || "N/A"}: ${message}`));
            } else {
                // Lỗi ngoài axios (ví dụ: lỗi runtime)
                dispatch(loadDashboardInfo_Fail(`Lỗi không xác định: ${err.message || err}`));
            }
        }
    }
}