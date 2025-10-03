/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DashBoardType = {
    error: string;
    loading: boolean;
    data: any[];
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
    }
})

export const { loadDashboardInfo_Start, loadDashboardInfo_Success, loadDashboardInfo_Fail } = dashboardSlice.actions;
export default dashboardSlice.reducer;