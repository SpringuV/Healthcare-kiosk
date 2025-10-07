/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardDataType } from "@/components/dashboard/dashboard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DashBoardType = {
    error: string;
    loading: boolean;
    data: DashboardDataType[];
}

const initialState: DashBoardType = {
    error: "",
    data: [],
    loading: false
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // start dashboard process
        loadDashboardInfo_Start: (state) => {
            state.loading = true;
            state.error = "";
        },

        // loadding success
        loadDashboardInfo_Success: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.data = action.payload;
            state.error = "";
        },
        // loadding fail
        loadDashboardInfo_Fail: (state, action) => {
            state.loading = false;
            state.error = action.payload; // lỗi từ API
        },

        clearDashboard: (state) => {
            state.loading = false;
            state.data = [];
            state.error = "";
        },
    }
})

export const { loadDashboardInfo_Start, loadDashboardInfo_Success, loadDashboardInfo_Fail, clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;