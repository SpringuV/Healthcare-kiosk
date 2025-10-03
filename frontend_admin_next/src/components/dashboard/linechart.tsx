/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAppNotification } from "@/utils/notification"
import { useEffect, useMemo, useState } from "react"
import { DashboardDataType } from "./dashboard"
import { Button } from "antd"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

type TransactionDataType = {
    date: string
    total_orders: number
    paid_orders: number
    total_money: number
}[]

interface LineChartProps {
    dataProps: DashboardDataType | null
}

function CustomLineChart(props: LineChartProps) {
    const { dataProps } = props
    // console.log(">> check data props: ", dataProps)

    const [transactionData, setTransactionData] = useState<TransactionDataType>([])
    const [mode, setMode] = useState<"day" | "month">("day")

    // convert DashboardDataType -> TransactionDataType
    useEffect(() => {
        if (dataProps && Array.isArray(dataProps.datas)) {
            const mapped: TransactionDataType = dataProps.datas.map((item) => ({
                date: item.order_date.slice(0, 10), // yyyy-MM-dd
                total_orders:
                    item.total_paid_orders +
                    item.total_unpaid_orders +
                    item.total_cancelled_orders,
                paid_orders: item.total_paid_orders,
                total_money: item.order_money,
            }))
            console.log(">> Mapped transaction data:", mapped)
            setTransactionData(mapped)
        }
    }, [dataProps])

    // Tạo list ngày (7 ngày gần nhất)
    const getLast7Days = () => {
        const result: string[] = []
        const today = new Date()
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            result.push(d.toISOString().slice(0, 10)) // yyyy-MM-dd
        }
        return result
    }

    // Tạo list tháng (12 tháng gần nhất)
    const getLast12Months = () => {
        const result: string[] = []
        const today = new Date()
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
            result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`)
        }
        return result
    }

    const chartData = useMemo(() => {
        if (mode === "day") {
            // 7 ngày gần nhất
            return getLast7Days().map((day) => {
                const item = transactionData.find((t) => t.date === day)
                return {
                    date: day,
                    total_orders: item?.total_orders ?? 0,
                    paid_orders: item?.paid_orders ?? 0,
                    total_money: item?.total_money ?? 0,
                }
            })
        } else {
            // 12 tháng gần nhất
            return getLast12Months().map((month) => {
                // Lấy tất cả item trong tháng đó
                const items = transactionData.filter((t) => t.date.startsWith(month))
                const total_orders = items.reduce((sum, i) => sum + i.total_orders, 0)
                const paid_orders = items.reduce((sum, i) => sum + i.paid_orders, 0)
                const total_money = items.reduce((sum, i) => sum + i.total_money, 0)
                return {
                    date: month,
                    total_orders,
                    paid_orders,
                    total_money,
                }
            })
        }
    }, [mode, transactionData])

    console.log(">> Chart data:", chartData)

    // Format số tiền
    const formatMoney = (value: number) => {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + "M"
        } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + "K"
        }
        return value.toString()
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border-2 border-[#ccc] rounded">
                    <p className="m-0 font-bold">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className={`my-1 text-[${entry.color}]`}>
                            {entry.name}:{" "}
                            {entry.dataKey === "total_money"
                                ? entry.value.toLocaleString("vi-VN") + " VNĐ"
                                : entry.value + " đơn"}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Button type={mode === "day" ? "primary" : "default"} onClick={() => setMode("day")}>
                    1 tuần gần đây
                </Button>
                <Button
                    type={mode === "month" ? "primary" : "default"}
                    onClick={() => setMode("month")}
                    className="ml-2"
                >
                    12 tháng
                </Button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        angle={mode === "month" ? -45 : 0}
                        textAnchor={mode === "month" ? "end" : "middle"}
                        height={mode === "month" ? 70 : 30}
                    />
                    {/* Trục Y bên trái - Số đơn */}
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12 }}
                        label={{
                            value: "Số đơn hàng",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    {/* Trục Y bên phải - Tổng tiền */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatMoney}
                        label={{
                            value: "Tổng tiền (VNĐ)",
                            angle: 90,
                            position: "insideRight",
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: "10px" }}
                        formatter={(value) => {
                            const labels: { [key: string]: string } = {
                                total_orders: "Tổng số đơn",
                                paid_orders: "Đã thanh toán",
                                total_money: "Tổng tiền",
                            }
                            return labels[value] || value
                        }}
                    />
                    {/* Line 1: Tổng số đơn */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="total_orders"
                        stroke="#1890ff"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                        name="total_orders"
                    />
                    {/* Line 2: Đã thanh toán */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="paid_orders"
                        stroke="#52c41a"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                        name="paid_orders"
                    />
                    {/* Line 3: Tổng tiền */}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="total_money"
                        stroke="#faad14"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                        name="total_money"
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default CustomLineChart