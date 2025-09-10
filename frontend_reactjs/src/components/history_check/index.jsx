import { useNavigate } from "react-router-dom"
import { Modal, Table, Tag, DatePicker, Button, Spin, Row, Col, Tooltip } from "antd"
import dayjs from "dayjs"
import { useMemo, useState } from "react"
import OrderDetail from "./order_detail"
import { patient_get_history_check, patient_put_cancelled_payment } from "../../services/patient"
import { useGlobalContext } from "../context/provider"
import { Helmet } from "react-helmet-async"
import { EyeOutlined, CloseCircleOutlined, CreditCardOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"
import { select_history_booking_data } from "../../reducers"
import { LoadingOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

function ResultSearch() {
    const navigate = useNavigate()

    // State quản lý
    const [isModalDetail, setIsModalDetail] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [dateRange, setDateRange] = useState(null)
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [loadingTable, setLoadingTable] = useState(false)
    const { setPaymentAgain, setFlowType } = useGlobalContext()
    const patient_history_booking = useSelector(select_history_booking_data)
    const [orders, setOrders] = useState(patient_history_booking.history)
    const patient = patient_history_booking?.patient
    const [localLoading, setLocalLoading] = useState(false)

    // Mở modal chi tiết
    const onOpen = (order) => {
        setSelectedOrder(order)
        setIsModalDetail(true)
    };

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

    // Về trang chủ
    const handleReturnHome = async () => {
        navigate("/", { replace: true })
        window.history.pushState(null, null, "/")
        window.onpopstate = () => {
            navigate("/", { replace: true })
        }
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

    // Thanh toán đơn
    const handlePaying = (order) => {
        setPaymentAgain({
            info_user: patient_history_booking.patient,
            info_order: order
        })
        setFlowType("non-insurance")
        navigate("/non-insur/banking")
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
                        <EyeOutlined className="hover:!text-blue-500 !text-base !cursor-pointer" onClick={() => onOpen(record)} />
                    </Tooltip>

                    {/* Nếu chưa thanh toán thì hiển thị thêm hủy + thanh toán */}
                    {record.payment_status === "UNPAID" && (
                        <>
                            <Tooltip title="Hủy phiếu khám">
                                <Spin spinning={loadingCancel} indicator={<LoadingOutlined />}>
                                    <CloseCircleOutlined className="hover:!text-blue-500 !text-base !cursor-pointer" onClick={() => handleCancelOrder(record)} />
                                </Spin>
                            </Tooltip>
                            <Tooltip title="Thanh toán">
                                <CreditCardOutlined className="hover:!text-blue-500 !text-base !cursor-pointer" onClick={() => handlePaying(record)} />
                            </Tooltip>
                        </>
                    )}
                </div>
            ),
        },
    ]

    return (
        <div className="mx-[5%] bg-white p-3 rounded-lg mb-20">
            {patient ? (
                <>
                    <Helmet>
                        <title>Lịch sử khám bệnh</title>
                    </Helmet>
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
                                <Button className="mr-2" type="primary" onClick={() => handleCancelOrder(selectedOrder)}>Hủy thanh toán</Button>
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
                                        setLocalLoading(true)
                                        setTimeout(() => {
                                            handleReturnHome()
                                            setLocalLoading(false)
                                        }, Math.random(2000, 7000))
                                    }} type="button">
                                    {localLoading === true ? "Đang xử lý ..." : "Về trang chủ"}
                                </Button>
                            </Spin>
                        </Tooltip>
                    </div>
                </>
            ) : (
                <div className="text-center text-red-500 font-bold">
                    Không có thông tin người khám
                </div>
            )}
        </div>
    )
}

export default ResultSearch