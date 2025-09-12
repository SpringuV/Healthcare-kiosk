import { Button, Col, Modal, Row, Spin, Tooltip, DatePicker, Select, Input, Switch, Pagination } from "antd"
import CartItem from "./cart_item"
import { useEffect, useMemo, useState } from "react"
import { patient_get_history_check, patient_put_cancelled_payment } from "../../services/patient"
import { useNavigate } from "react-router-dom"
import OrderDetail from "./order_detail"
import { LoadingOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import { useGlobalContext } from "../context/provider"
dayjs.extend(isBetween)
const { RangePicker } = DatePicker
const { Option } = Select
function DataGridList(props) {
    const { data_patient_history_booking } = props
    const navigate = useNavigate()
    const { setPaymentAgain, setFlowType } = useGlobalContext()
    const [isModalDetail, setIsModalDetail] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [loadingGridData, setLoadingGridData] = useState(false)
    const [localLoading, setLocalLoading] = useState(false)
    const [orders, setOrders] = useState(data_patient_history_booking?.history)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(8)
    const [loadingPaymentAgain, setLoadingPaymentAgain] = useState(false)
    const delay = [2000, 3000, 1000]
    const patient = data_patient_history_booking?.patient
    const [filters, setFilters] = useState({
        date: null,
        status: null,
        service: null,
        price: null,
        doctor_name: null
    })
    const [isASC, setASC] = useState(true)

    // Đóng modal chi tiết
    const onCancelModal = () => {
        setIsModalDetail(false)
        setSelectedOrder(null)
    }

    // Mở modal chi tiết
    const onOpen = (order) => {
        setSelectedOrder(order)
        setIsModalDetail(true)
    }

    // Thanh toán đơn
    const handlePaying = (order) => {
        setPaymentAgain({
            info_user: data_patient_history_booking.patient,
            info_order: order
        })
        setFlowType("non-insurance")
        navigate("/non-insur/banking")
    }

    const handleReload = async () => {
        try {
            setLoadingGridData(true)
            const res = await patient_get_history_check(patient.citizen_id)
            if (res.ok) {
                setOrders(res.data.history)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingGridData(false)  // tắt loading
        }
    }

    useEffect(() => {
        if (patient?.citizen_id) {
            handleReload()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patient?.citizen_id])
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

    const options = [
        { label: "Đã thanh toán", value: "PAID" },
        { label: "Chưa thanh toán", value: "UNPAID" },
        { label: "Đã hủy", value: "CANCELLED" },
    ]

    const filterOrders = useMemo(() => {
        if ((!filters.doctor_name || filters.doctor_name.length === 0) && (!filters.date || filters.date.length === 0) && (!filters.status || filters.status.length === 0) && (!filters.service || filters.service.length === 0)) {
            return orders
        }
        return orders.filter((item) => {
            let isValid = true
            if (filters.date && filters.date.length === 2) {
                const [start, end] = filters.date
                const orderDate = dayjs(item.time_order)
                if (!orderDate.isBetween(start, end, "day", "[]")) {
                    // [] nghĩa là inclusive (>= start && <= end)
                    isValid = false
                }
                // const startDate = dayjs(start).toDate()
                // const endDate = dayjs(end).toDate()
                // if (!(orderDate >= startDate && orderDate <= endDate)) {
                //     isValid = false
                // }
            }
            if (filters.status && filters.status.length > 0) {
                if (!filters.status.includes(item.payment_status)) {
                    isValid = false
                }
            }
            if (filters.service && filters.service.length > 0) {
                if (!filters.service.includes(item.service_name)) {
                    isValid = false
                }
            }
            if (filters.doctor_name && filters.doctor_name.length > 0) {
                if (!filters.doctor_name.includes(item.doctor_name)) {
                    isValid = false
                }
            }
            return isValid
        })
    }, [filters, orders])
    //return isValid chính là quyết định: item này có lọc qua hay bị loại bỏ (true) là giữ lại kết quả
    const sortPrices = useMemo(() => {
        const result = [...filterOrders]
        if (isASC) {
            result.sort((a, b) => a.price - b.price) // tăng dần
        } else {
            result.sort((a, b) => b.price - a.price) // giảm dần
        }
        return result
    }, [filterOrders, isASC])

    const handleChangePrice = () => {
        setASC(!isASC)
    }

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        return sortPrices.slice(startIndex, endIndex)
    }, [sortPrices, currentPage, pageSize])


    return (
        <>
            <>
                {/* modal load */}
                <Modal
                    open={localLoading || loadingPaymentAgain}
                    footer={null}
                    closable={false}
                    centered
                    maskClosable={false}
                    styles={{ body: { textAlign: "center" } }}
                >
                    <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                    <div className="text-lg font-semibold loading-dots">Đang xử lý, vui lòng chờ</div>
                </Modal>
                <Row gutter={[16, 16]} className="mb-5 text-sm lg:text-base">
                    <Col className="flex-col lg:flex-row items-start lg:items-center justify-center">
                        <label className="!mb-2 md:!mb-0" htmlFor="filter_time">Lọc theo thời gian: &nbsp;</label>
                        <RangePicker
                            className="w-full md:w-fit"
                            id={"filter_time"}
                            onChange={(values) => {
                                setFilters({ ...filters, date: values })
                            }}
                            allowClear
                            format={"DD/MM/YYYY"}
                            placeholder={["Từ ngày", "Đến ngày"]}
                            valueFormat="YYYY-MM-DD"
                            value={filters.date}
                        >
                        </RangePicker>
                    </Col>
                    <Col className="flex items-center justify-between w-full md:w-fit">
                        <label htmlFor="filter_status">Lọc theo trạng thái: &nbsp;</label>
                        <Select
                            id="filter_status"
                            allowClear
                            className="!min-w-[200px]"
                            mode="multiple"
                            placeholder="Chọn trạng thái"
                            options={options}
                            onChange={(value) => setFilters({ ...filters, status: value })}
                        />
                    </Col>
                    <Col className="flex items-center justify-between w-full md:w-fit">
                        <label htmlFor="filter_service_name">Lọc theo dịch vụ: &nbsp;</label>
                        <Select
                            classNames={"w-full md:w-fit"}
                            id="filter_service_name"
                            className="!min-w-[200px]"
                            placeholder="Tìm theo dịch vụ"
                            allowClear
                            mode="multiple"
                            onChange={(value) => setFilters({ ...filters, service: value })}
                        >
                            {[...new Set(orders.map(item => item.service_name))].map((service, index) => (
                                <Option key={index} value={service}>{service}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col className="flex items-center justify-between w-full md:w-fit">
                        <label htmlFor="filter_doctor_name">Lọc theo Bác sĩ: &nbsp;</label>
                        <Select
                            id="filter_doctor_name"
                            className="!min-w-[200px]"
                            placeholder="Tìm theo Bác sĩ"
                            allowClear
                            mode="multiple"
                            onChange={(value) => setFilters({ ...filters, doctor_name: value })}
                        >
                            {[...new Set(orders.map((item) => item.doctor_name))].map((doctor, index) => (
                                <Option key={index} value={doctor}>{doctor}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col className="flex items-center">
                        <label>Lọc theo giá: &nbsp;</label>
                        <Switch
                            onClick={handleChangePrice}
                            checkedChildren="Tăng dần"
                            unCheckedChildren="Giảm dần">
                        </Switch>
                    </Col>
                </Row>
                {/* show data */}
                {paginatedOrders && paginatedOrders.length > 0 ? (
                    <Row gutter={[20, 20]} className="mb-2">
                        {paginatedOrders.map((item, index) => (
                            <Col key={index} xs={24} sm={24} md={12} lg={8} xl={6}>
                                <CartItem
                                    loadingCancel={loadingCancel}
                                    onCancelPayingOrder={() => handleCancelOrder(item)}
                                    onOpenModal={() => onOpen(item)}
                                    orderItem={item}
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div>Không có lịch sử khám bệnh</div>
                )}
            </>
            {/* Modal chi tiết */}
            <Modal
                centered={true}
                title="Chi tiết đơn hàng"
                width={{ xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" }}
                open={isModalDetail}
                onCancel={onCancelModal}
                footer={
                    selectedOrder?.payment_status?.trim()?.toUpperCase() === "UNPAID"
                        ? (<div>
                            <Button className="mr-2" type="primary" onClick={() => {
                                setLoadingPaymentAgain(true)
                                setTimeout(() => {
                                    handlePaying(selectedOrder)
                                }, delay[Math.floor(Math.random() * delay.length)])

                            }}>Thanh toán lại</Button>
                            <Button className="mr-2 bg-red-400 hover:!bg-red-600" type="primary" onClick={() => handleCancelOrder(selectedOrder)}>Hủy thanh toán</Button>
                            <Button onClick={onCancelModal} type="dashed">Đóng</Button>
                        </div>)
                        : (<Button onClick={onCancelModal}>Đóng</Button>)
                }
            >
                <OrderDetail order={selectedOrder} />
            </Modal>
            <Pagination
                align="center"
                total={sortPrices.length}
                showTotal={total => `Tổng ${total}`}
                current={currentPage}
                pageSize={pageSize}
                showSizeChanger
                onChange={(page, pageSize) => {
                    setCurrentPage(page)
                    setPageSize(pageSize)
                }}
            />
            {/* Nút về trang chủ */}
            <div className="flex justify-between items-center mt-2">
                <Tooltip title="Tải lại dữ liệu mới nhất">
                    <Spin spinning={loadingGridData} indicator={<LoadingOutlined />}>
                        <Button onClick={handleReload} className="bg-orange-400 hover:!bg-orange-600" type="primary" >Tải lại dữ liệu</Button>
                    </Spin>
                </Tooltip>
                <Tooltip title="Quay về trang chủ">
                    <Spin spinning={localLoading} indicator={<LoadingOutlined />}>
                        <Button disabled={localLoading} className="!text-sm lg:!text-base text-white !font-medium !px-5 !py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700"
                            onClick={() => {
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

export default DataGridList