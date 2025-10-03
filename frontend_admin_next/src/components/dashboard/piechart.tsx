/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Legend, Pie, ResponsiveContainer, Tooltip, PieChart } from "recharts"
import { DashboardDataType } from "./dashboard"


interface PieChartProps {
    dataProps: DashboardDataType | null
}
function CustomPieChart(props: PieChartProps) {
    const { dataProps } = props
    // Tính tổng các loại đơn
    let totalPaidOrder = 0
    let totalUnpaidOrder = 0
    let totalCancelledOrder = 0

    if (dataProps?.datas) {
        dataProps.datas.forEach((item: any) => {
            totalPaidOrder += item.total_paid_orders
            totalUnpaidOrder += item.total_unpaid_orders
            totalCancelledOrder += item.total_cancelled_orders
        })
    }

    const totalOrders = totalPaidOrder + totalUnpaidOrder + totalCancelledOrder

    // Data cho Pie chart
    const pieData = [
        { name: 'Đã thanh toán', value: totalPaidOrder, color: '#52c41a' },
        { name: 'Chưa thanh toán', value: totalUnpaidOrder, color: '#faad14' },
        { name: 'Đã hủy', value: totalCancelledOrder, color: '#ff4d4f' },
    ]

    // Custom label hiển thị % trên Pie
    const renderLabel = (entry: any) => {
        const percent = ((entry.value / totalOrders) * 100).toFixed(1)
        return `${percent}%`
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0]
            const percent = ((data.value / totalOrders) * 100).toFixed(1)
            return (
                <div className='bg-white p-3 border-2 boder-[#ccc] rounded'>
                    <p className={`m-0 font-bold text-[${data.payload.color}]`}>{data.name}</p>
                    <p className='my-1'>
                        Số lượng: <strong>{data.value}</strong> đơn
                    </p>
                    <p className='my-1'>
                        Tỷ lệ: <strong>{percent}%</strong>
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <>
            <div className='mb-10'>
                <h2 className='text-lg font-semibold mb-4'>
                    Thống kê trạng thái giao dịch
                </h2>
                <div className='grid grid-cols-2 place-content-center gap-5 '> 
                    {/* flex items-center  flex-wrap */}
                    <div className='w-[400px] h-[400px] mx-auto'>
                        <ResponsiveContainer className="w-full h-full">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderLabel}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="middle"
                                    align="right"
                                    layout="vertical"
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Cards */}
                    <div className='flex flex-col gap-3'>
                        <div className='p-4 bg-slate-200 rounded-lg max-w-52'>
                            <div className='text-sm text-gray-500'>
                                Tổng số đơn hàng
                            </div>
                            <div className='text-3xl font-bold text-gray-800'>
                                {totalOrders}
                            </div>
                        </div>
                        <div className='p-4 bg-orange-100 rounded-lg max-w-52 border-lime-300 border-2'>
                            <div className='text-sm text-lime-500'>
                                Đã thanh toán
                            </div>
                            <div className='text-2xl font-bold text-lime-500'>
                                {totalPaidOrder}{' '}
                                <span className='text-sm font-normal'>
                                    ({totalOrders > 0 ? ((totalPaidOrder / totalOrders) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                        </div>
                        <div className='p-4 bg-orange-100 rounded-lg max-w-52 border-amber-200 border-2'>
                            <div className='text-sm text-[#faad14]'>
                                Chưa thanh toán
                            </div>
                            <div className='text-2xl font-bold text-[#faad14]'>
                                {totalUnpaidOrder}{' '}
                                <span className='text-sm font-normal'>
                                    ({totalOrders > 0 ? ((totalUnpaidOrder / totalOrders) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                        </div>
                        <div className='p-4 bg-[#fff1f0] rounded-lg max-w-52 border-[#ffa39e] border-2'>
                            <div className='text-sm text-[#ff4d4f]'>
                                Đã hủy
                            </div>
                            <div className='text-2xl font-bold text-[#ff4d4f]'>
                                {totalCancelledOrder}{' '}
                                <span className='text-sm font-normal'>
                                    ({totalOrders > 0 ? ((totalCancelledOrder / totalOrders) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default CustomPieChart