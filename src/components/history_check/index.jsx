import { useNavigate } from "react-router-dom"
import { Modal, Table, Tag, DatePicker, Button, Spin, Row, Col } from "antd"
import dayjs from "dayjs"
import { get, put } from "../../utils/request"
import { useMemo, useState } from "react"
import OrderDetail from "./order_detail"
import { usePatientHistory } from "../context/patient_history_context"
import { usePaymentAgain } from "../context/payment_again_context"
import { useStateStep } from "../context/state_step_context"

const { RangePicker } = DatePicker

function ResultSearch() {
    const navigate = useNavigate()
    
    // State quản lý
    const [isModalDetail, setIsModalDetail] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [dateRange, setDateRange] = useState(null)
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [loadingTable, setLoadingTable] = useState(false)
    const { setPaymentAgain } = usePaymentAgain()
    const { patientHistory, clearPatientHistory } = usePatientHistory()
    const [orders, setOrders] = useState(patientHistory.history)
    const {setFlowType} = useStateStep()

    const patient = patientHistory.patient
    console.log(patientHistory)
    // Mở modal chi tiết
    const onOpen = (order) => {
        setSelectedOrder(order)
        setIsModalDetail(true)
    };

    const handleReload = async () => {
        try {
            setLoadingTable(true)
            const res = await get(`/patient/history/${patient.citizen_id}`)
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

    // Về trang chủ
    const handleReturnHome = () => {
        navigate("/", { replace: true })
        window.history.pushState(null, null, "/")
        window.onpopstate = () => {
            navigate("/", { replace: true })
        }
        clearPatientHistory()
    }

    // Bộ lọc dịch vụ
    const serviceFilter = [...new Set(orders.map((item) => item.service_name))].map((service) => ({ text: service, value: service }))

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
                    const response = await put(`/orders/cancel/${order.order_id}`)
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

    // Thanh toán đơn
    const handlePaying = (order) => {
        setPaymentAgain({
            info_user: patientHistory.patient,
            info_order: order
        })
        setFlowType("non-insurance")
        navigate("/non-insur/banking")
    }

    // Table columns
    const columns = [
        {
            title: "Mã Phiếu",
            dataIndex: "order_id",
            key: "order_id",
            align: "center",
        },
        {
            title: "Thời gian",
            dataIndex: "time_order",
            key: "time_order",
            align: "center",
            render: (text) => dayjs(text).format("DD/MM/YYYY"),
            sorter: (a, b) => dayjs(a.time_order).unix() - dayjs(b.time_order).unix(),
        },
        {
            title: "Dịch vụ",
            dataIndex: "service_name",
            key: "service_name",
            align: "center",
            filters: serviceFilter,
            sorter: (a, b) => a.service_name.localeCompare(b.service_name),
            onFilter: (value, record) => record.service_name === value,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            key: "price",
            align: "center",
            render: (text) => Math.round(text * 26181).toLocaleString() + " đ",
            sorter: (a, b) => a.price - b.price,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Trạng thái",
            dataIndex: "payment_status",
            key: "payment_status",
            align: "center",
            render: (text, record) => {
                const statusMap = {
                    PAID: { color: "green", label: "Đã thanh toán" },
                    UNPAID: { color: "geekblue", label: "Chưa thanh toán" },
                    CANCELLED: { color: "volcano", label: "Đã hủy" },
                };
                const key = text?.trim()?.toUpperCase();
                const { color, label } = statusMap[key] || {
                    color: "default",
                    label: "Không rõ",
                };

                return (
                    <>
                        <Tag color={color}>{label}</Tag>
                        {key === "UNPAID" && (
                            <>
                                <Button className="mr-2" type="dashed" onClick={() => handleCancelOrder(record)} loading={loadingCancel}>Hủy</Button>
                                <Button type="dashed" loading={loadingCancel} onClick={() => handlePaying(record)}>Thanh toán</Button>
                            </>
                        )}
                    </>
                );
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
            render: (record) => (
                <span className="hover:cursor-pointer" >
                    <Button onClick={() => onOpen(record)} color="magenta">Chi Tiết</Button>
                </span>
            ),
        },
    ]

    return (
        <div className="mx-[5%] bg-white p-3 rounded-lg mb-20">
            <div className="mb-4">
                <h1 className="text-center text-[30px] font-semibold mb-4">Thông tin người khám</h1>
                <Row gutter={[20, 20]}>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Mã căn cước: </label>
                        <span className="font-semibold italic">{patient.citizen_id}</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Tên người khám: </label>
                        <span className="font-semibold italic">{patient.fullname}</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Ngày sinh: </label>
                        <span className="font-semibold italic">{dayjs(patient.dob).format("DD/MM/YYYY")}</span>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Dân tộc: </label>
                        <span className="font-semibold italic">{patient.ethnic}</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Giới tính: </label>
                        <span className="font-semibold italic">{patient.gender}</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Bảo hiểm y tế: </label>
                        <span className="font-semibold italic">{patient.is_insurance === true ? "Có" : "Không"}</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Số điện thoại: </label>
                        <span className="font-semibold italic">{patient.phone_number}</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                        <label>Nghề nghiệp: </label>
                        <span className="font-semibold italic">{patient.job}</span>
                    </Col>
                    <Col xs={24} sm={24}>
                        <label>Địa chỉ: </label>
                        <span className="font-semibold italic">{patient.address}</span>
                    </Col>
                </Row>
            </div>
            <h1 className="text-center text-[30px] font-semibold">Lịch sử khám bệnh</h1>
            {/* Bộ lọc ngày */}
            <div className="flex items-center justify-end mb-3">
                <label className="mr-3">Lọc theo ngày</label>
                <RangePicker placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} format="DD/MM/YYYY" onChange={(values) => setDateRange(values)} value={dateRange} />
            </div>

            {/* Table */}
            <Table bordered rowKey="order_id" loading={loadingTable} dataSource={filteredOrders} columns={columns} pagination={{ position: ["bottomCenter"] }} />

            {/* Modal chi tiết */}
            <Modal
                title="Chi tiết đơn hàng"
                width={{ xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" }}
                open={isModalDetail}
                onCancel={onCancelModal}
                footer={
                    selectedOrder?.payment_status?.trim()?.toUpperCase() === "UNPAID" ? (<div>
                        <Button className="mr-2" type="primary" onClick={() => handleCancelOrder(selectedOrder)}>Hủy thanh toán</Button>
                        <Button onClick={onCancelModal} type="dashed">Đóng</Button>
                    </div>) : (<Button onClick={onCancelModal}>Đóng</Button>)
                }
            >
                <OrderDetail order={selectedOrder} />
            </Modal>
            {/* Nút về trang chủ */}
            <div className="flex justify-between items-center mt-2">
                <Button onClick={handleReload} type="primary" >Tải lại dữ liệu</Button>
                <button className="text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700"
                    onClick={handleReturnHome} type="button">
                    Xác nhận và về trang chủ
                </button>
            </div>
        </div>
    )
}

export default ResultSearch