/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "@/services/api"
import { AppDispatch } from "../store"
import { loadDashboardInfo_Fail, loadDashboardInfo_Start } from "./dashboard.slice"

export const fetchDashBoard = () =>{
    return async (dispatch: AppDispatch) =>{
        dispatch(loadDashboardInfo_Start())
        try {
            const res = await get('/api/user/admin/get_dashboard_info')
        } catch (err: any) {
            dispatch(loadDashboardInfo_Fail(err.message || "Error fetch dashboard"))
        }
    }
}