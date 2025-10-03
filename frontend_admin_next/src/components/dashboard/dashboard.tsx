/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { RootState } from '@/redux/store'
import { get } from '@/services/api'
import { useAppNotification } from '@/utils/notification'
import { getSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CustomLineChart from './linechart'
import CustomPieChart from './piechart'

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
    const [dashboardData, setDashboardData] = useState<DashboardDataType | null>(null)
    const { contextHolder, openNotificationWithIcon } = useAppNotification()

    useEffect(() => {
        // Lấy token từ session
        const fetchTokenAndData = async () => {
            const session = await getSession()
            if (session?.user?.accessToken) {
                // Fetch data dashboard
                try {
                    const res = await get(
                        '/api/user/admin/get_dashboard_info',
                        undefined,
                        { Authorization: `Bearer ${session.user.accessToken}` }
                    )
                    if (res) {
                        setDashboardData(res.data as DashboardDataType)
                        openNotificationWithIcon('Thành công', 'Load dữ liệu thành công', 'success')
                    }
                } catch (err) {
                    console.error('Error fetching dashboard:', err)
                    openNotificationWithIcon('Lỗi', 'Lỗi khi tải dữ liệu', 'error')
                }
            }
        }
        fetchTokenAndData()
    }, [])


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
                <CustomPieChart dataProps={dashboardData} />

                {/* Line Chart Section */}
                <div>
                    <h2 className='text-lg font-semibold mb-4'>
                        Thống kê giao dịch theo ngày/tháng
                    </h2>
                    <CustomLineChart dataProps={dashboardData} />
                </div>
            </div>
        </>
    )
}

export default Dashboard