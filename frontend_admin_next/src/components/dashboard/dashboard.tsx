/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { RootState } from '@/redux/store'
import { useAppNotification } from '@/utils/notification'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '@/redux/store'
import CustomLineChart from './linechart'
import CustomPieChart from './piechart'
import { fetchDashBoard } from '@/redux/dashboard/dashboard.thunk'
import { useSessionContext } from '@/library/session.context'

export type DashboardDataType = {
    datas: {
        order_date: string
        order_money: number
        total_paid_orders: number
        total_unpaid_orders: number
        total_cancelled_orders: number
    }[]
}
const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const session = useSessionContext();
    // console.log("check sesssion: dasshboard: ", session)
    // access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IkFETUlOIiwiYXVkIjoiQURNSU5fU0VSVklDRVMiLCJleHAiOjE3NTk4NjY2MDYsInR5cGUiOiJhY2Nlc3MiLCJzaWQiOiIyZmNmYTA0Yy0yYWNlLTRkN2QtYjEwNS0yM2IxMjE3NzAwZTAifQ.jC4NpyYL9-YF-TjbbZIyJN2tMmYy_T-KQsnWFpy6WME"
    // expires: "2025-11-06T19:26:36.906Z"
    // expires_in: 2700
    // refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IkFETUlOIiwiYXVkIjoiQURNSU5fU0VSVklDRVMiLCJleHAiOjE3NTk5NDQyODIsInR5cGUiOiJyZWZyZXNoIiwic2lkIjoiMmZjZmEwNGMtMmFjZS00ZDdkLWIxMDUtMjNiMTIxNzcwMGUwIn0.LgkspcgRJ6LGrT4uP6k_ZQj7ZSvbdvvfVZK6-wHwM3A"
    // session_id: "2fcfa04c-2ace-4d7d-b105-23b1217700e0"
    // token_type: "bearer"
    // user: 
    //     email: "email"
    //     id: "1"
    //     isVerify: true
    //     realname: "admin"
    //     role: "ADMIN"
    //     type: "ADMIN"
    //     username: "admin"
    const { data, loading, error } = useSelector((state: RootState) => state.dashboard)
    const { contextHolder, openNotificationWithIcon } = useAppNotification()
    // Dùng ref để đảm bảo chỉ gọi API 1 lần
    const hasFetched = useRef(false)
    useEffect(() => {
        console.log("Dashboard render - session:", session?.user?.username)
        // CHỈ fetch nếu:
        // 1. Có token
        // 2. Chưa có data trong Redux
        // 3. Không đang loading
        // 4. Chưa fetch lần nào
        if (session?.access_token && !data && !loading && !hasFetched.current) {
            hasFetched.current = true
            console.log("Fetching dashboard data...")
            dispatch(fetchDashBoard(session.access_token))
        } else {
            console.log("⏭ => Skip fetch - data exists or loading:", {
                hasData: !!data,
                loading,
                hasFetched: hasFetched.current
            })
        }
    }, [session?.access_token, data, loading, dispatch])

    useEffect(() => {
        if (error) {
            openNotificationWithIcon('Lỗi', error, 'error')
        }
    }, [error, openNotificationWithIcon])

    useEffect(() => {
        if (data && !loading) {
            openNotificationWithIcon('Thành công', 'Load dữ liệu thành công', 'success')
        }
    }, [data, loading, openNotificationWithIcon])
    return (
        <>
            {contextHolder}
            <div className='p-5'>
                <h1 className='text-2xl font-bold mb-5'>
                    Dashboard
                </h1>

                {/* Pie Chart Section */}
                <h2 className='text-lg font-semibold mb-4'>
                    Thống kê trạng thái giao dịch
                </h2>
                <CustomPieChart dataProps={data} />

                {/* Line Chart Section */}
                <div>
                    <h2 className='text-lg font-semibold mb-4'>
                        Thống kê giao dịch theo ngày/tháng
                    </h2>
                    <CustomLineChart dataProps={data} />
                </div>
            </div>
        </>
    )
}

export default Dashboard