import { Modal, Table, Tag, DatePicker, Button, Spin, Row, Col, Tooltip } from "antd"
import { useMemo, useState } from "react"
import { useGlobalContext } from "../context/provider"
import OrderDetail from "./order_detail"
import { patient_get_history_check, patient_put_cancelled_payment } from "../../services/patient"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import { EyeOutlined, CloseCircleOutlined, CreditCardOutlined, LoadingOutlined } from "@ant-design/icons"

const { RangePicker } = DatePicker
function DataTable(props) {
    const { data_patient_history_booking } = props
    const navigate = useNavigate()

    // State quản lý
    const [loadingCancel, setLoadingCancel] = useState(false)
    const { setPaymentAgain, setFlowType } = useGlobalContext()
    const [orders, setOrders] = useState(data_patient_history_booking.history)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalDetail, setIsModalDetail] = useState(false)
    const [loadingTable, setLoadingTable] = useState(false)
    const [dateRange, setDateRange] = useState(null)
    const [localLoading, setLocalLoading] = useState(false)

    const patient = data_patient_history_booking?.patient
    const handleReload = async () => {
        try {
            setLoadingTable(true)
            const res = await patient_get_history_check(patient.citizen_id)
            if (res.ok) {
                setOrders(res.data.history)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingTable(false)  // tắt loading
        }
    }
    // Đóng modal chi tiết
    const onCancelModal = () => {
        setIsModalDetail(false)
        setSelectedOrder(null)
    };

    // Bộ lọc dịch vụ
    const serviceFilter = [...new Set(orders.map((item) => item.service_name))].map((service) => ({ text: service, value: service }))

    // Mở modal chi tiết
    const onOpen = (order) => {
        setSelectedOrder(order)
        setIsModalDetail(true)
    };


    // Lọc dữ liệu theo ngày
    const filteredOrders = useMemo(() => {
        if (!dateRange) return orders
        const [start, end] = dateRange
        return orders.filter((item) => {
            const orderDate = new Date(item.time_order)
            const startDate = start.toDate()
            const endDate = end.toDate()
            return orderDate >= startDate && orderDate <= endDate
        });
    }, [dateRange, orders]);

    // Thanh toán đơn
    const handlePaying = (order) => {
        setPaymentAgain({
            info_user: data_patient_history_booking.patient,
            info_order: order
        })
        setFlowType("non-insurance")
        navigate("/non-insur/banking")
    }


    // Hủy đơn
    const handleCancelOrder = (order) => {
        Modal.confirm({
            title: "Xác nhận hủy",
            content: `Bạn có chắc chắn muốn hủy phiếu khám ${order.order_id}?`,
            okText: "Đồng ý",
            cancelText: "Thoát",
            onOk: async () => {
                try {
                    setLoadingCancel(true)
                    const response = await patient_put_cancelled_payment(order.order_id)
                    setLoadingCancel(false)

                    if (response.ok) {
                        // Cập nhật trực tiếp UI
                        const newOrders = orders.map((item) => item.order_id === order.order_id ? { ...item, payment_status: "CANCELLED" } : item)
                        setOrders(newOrders)

                        // Nếu đang mở modal chi tiết, cập nhật luôn
                        if (selectedOrder?.order_id === order.order_id) {
                            setSelectedOrder({ ...order, payment_status: "CANCELLED" })
                        }
                    } else {
                        Modal.error({ title: "Hủy đơn thất bại" })
                    }
                } catch (err) {
                    setLoadingCancel(false)
                    console.error(err)
                    Modal.error({ title: "Đã có lỗi khi hủy đơn" })
                }
            },
        })
    }

    // Về trang chủ
    const handleReturnHome = async () => {
        navigate("/", { replace: true })
        window.history.pushState(null, null, "/")
        window.onpopstate = () => {
            navigate("/", { replace: true })
        }
    }
    // Table columns
    const columns = [
        {
            title: () => (
                <Tooltip mouseEnterDelay={0.2} title="Mã phiếu khám">
                    <span>Mã phiếu khám</span>
                </Tooltip>
            ),
            dataIndex: "order_id",
            key: "order_id",
            align: "center",
        },
        {
            title: () => (
                <Tooltip placement="top" title="Ngày khám bệnh, có thể sắp xếp từ mới đến cũ hoặc ngược lại" mouseEnterDelay={0.2}>
                    <span>Thời gian</span>
                </Tooltip>
            ),
            dataIndex: "time_order",
            key: "time_order",
            align: "center",
            render: (text) => dayjs(text).format("DD/MM/YYYY"),
            sorter: (a, b) => dayjs(a.time_order).unix() - dayjs(b.time_order).unix(),
        },
        {
            title: () => (
                <Tooltip title="Dịch vụ đã đăng ký khám" mouseEnterDelay={0.2}>
                    <span>Dịch vụ</span>
                </Tooltip>
            ),
            dataIndex: "service_name",
            key: "service_name",
            align: "center",
            filters: serviceFilter,
            sorter: (a, b) => a.service_name.localeCompare(b.service_name),
            onFilter: (value, record) => record.service_name === value,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: () => (
                <Tooltip title="Giá dịch vụ đã đăng ký khám" mouseEnterDelay={0.2}>
                    <span>Giá khám</span>
                </Tooltip>
            ),
            dataIndex: "price",
            key: "price",
            align: "center",
            render: (text) => Math.round(text * 26181).toLocaleString() + " đ",
            sorter: (a, b) => a.price - b.price,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: () => (
                <Tooltip title="Trạng thái thanh toán" mouseEnterDelay={0.2}>
                    <span>Trạng thái</span>
                </Tooltip>
            ),
            dataIndex: "payment_status",
            key: "payment_status",
            align: "center",
            render: (text) => {
                const statusMap = {
                    PAID: { color: "green", label: "Đã thanh toán" },
                    UNPAID: { color: "geekblue", label: "Chưa thanh toán" },
                    CANCELLED: { color: "volcano", label: "Đã hủy" },
                };
                const { color, label } = statusMap[text] || {
                    color: "default",
                    label: "Không rõ",
                };

                return <Tag color={color}>{label}</Tag>
            },
            filters: [
                { text: "Đã thanh toán", value: "PAID" },
                { text: "Chưa thanh toán", value: "UNPAID" },
                { text: "Đã hủy", value: "CANCELLED" },
            ],
            onFilter: (value, record) => record.payment_status === value,
        },
        {
            title: "Hành động",
            key: "actions",
            align: "center",
            render: (text, record) => (
                <div className="flex gap-4 justify-center">
                    {/* Chi tiết */}
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined className="hover:!text-blue-800 !text-blue-500 !text-base !cursor-pointer" onClick={() => onOpen(record)} />
                    </Tooltip>

                    {/* Nếu chưa thanh toán thì hiển thị thêm hủy + thanh toán */}
                    {record.payment_status === "UNPAID" && (
                        <>
                            <Tooltip title="Hủy phiếu khám">
                                <Spin spinning={loadingCancel} indicator={<LoadingOutlined />}>
                                    <CloseCircleOutlined className="!text-red-500 hover:!text-red-800 !text-base !cursor-pointer" onClick={() => handleCancelOrder(record)} />
                                </Spin>
                            </Tooltip>
                            <Tooltip title="Thanh toán">
                                <CreditCardOutlined className="hover:!text-purple-800 text-purple-500 !text-base !cursor-pointer" onClick={() => handlePaying(record)} />
                            </Tooltip>
                        </>
                    )}
                </div>
            ),
        },
    ]
    return (
        <>
            {/* modal load */}
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Đang xử lý, vui lòng chờ</div>
            </Modal>
            {/* Bộ lọc ngày */}
            <div className="flex items-center justify-end mb-3">
                <label className="mr-3">Lọc theo ngày</label>
                <Tooltip title="Chọn khoảng ngày để lọc">
                    <RangePicker placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} format="DD/MM/YYYY" onChange={(values) => setDateRange(values)} value={dateRange} />
                </Tooltip>
            </div>
            {/* Table */}
            <Table showSorterTooltip={false}
                bordered rowKey="order_id"
                loading={{
                    spinning: loadingTable,
                    indicator: <LoadingOutlined />
                }}
                dataSource={filteredOrders}
                columns={columns}
                pagination={{ position: ["bottomCenter"] }}
            />

            {/* Modal chi tiết */}
            <Modal
                centered={true}
                title="Chi tiết đơn hàng"
                width={{ xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" }}
                open={isModalDetail}
                onCancel={onCancelModal}
                footer={
                    selectedOrder?.payment_status?.trim()?.toUpperCase() === "UNPAID" ? (<div>
                        <Button className="mr-2" type="primary" onClick={() => {
                            const delay = [1000, 2000, 3000]
                            setLocalLoading(true)
                            setTimeout(() => {
                                handlePaying(selectedOrder)
                            }, delay[Math.floor(Math.random() * delay.length)])

                        }}>Thanh toán lại</Button>
                        <Button className="mr-2 bg-red-400 hover:!bg-red-600" type="primary" onClick={() => handleCancelOrder(selectedOrder)}>Hủy thanh toán</Button>
                        <Button onClick={onCancelModal} type="dashed">Đóng</Button>
                    </div>) : (<Button onClick={onCancelModal}>Đóng</Button>)
                }
            >
                <OrderDetail order={selectedOrder} />
            </Modal>
            {/* Nút về trang chủ */}
            <div className="flex justify-between items-center mt-2">
                <Tooltip title="Tải lại dữ liệu mới nhất">
                    <Button onClick={handleReload} type="primary" >Tải lại dữ liệu</Button>
                </Tooltip>
                <Tooltip title="Quay về trang chủ">
                    <Spin spinning={localLoading} indicator={<LoadingOutlined />}>
                        <Button disabled={localLoading} className="!text-base lg:!text-lg text-white !font-medium !px-5 !py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700"
                            onClick={() => {
                                const delay = [1000, 2000, 3000]
                                setLocalLoading(true)
                                setTimeout(() => {
                                    handleReturnHome()
                                    setLocalLoading(false)
                                }, delay[Math.floor(Math.random() * delay.length)])
                            }} type="button">
                            {localLoading === true ? "Đang xử lý ..." : "Về trang chủ"}
                        </Button>
                    </Spin>
                </Tooltip>
            </div>
        </>
    )
}

export default DataTable