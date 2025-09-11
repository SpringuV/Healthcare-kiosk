import { CloseCircleOutlined, CreditCardOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons"
import { Col, Row, Spin, Tag, Tooltip } from "antd"
import dayjs from "dayjs"

function CartItem(props) {
    const { orderItem, onOpenModal, onCancelPayingOrder, loadingCancel } = props;
    const amount = Math.round(orderItem.price * 26181).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    const paymentStatus = {
        CANCELLED: { text: "Đã hủy", color: "red" },
        PAID: { text: "Đã thanh toán", color: "green" },
        UNPAID: { text: "Chưa thanh toán", color: "purple" },
    }
    return (
        <>
            <div className="hover:bg-blue-50 focus:bg-blue-50">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="p-1 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 shadow-sm text-sm lg:text-base">
                        <h3 className="font-semibold ml-1">Mã phiếu:</h3>
                        <span className="w-1/2 text-center">{orderItem.order_id}</span>
                    </Row>
                    <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 shadow-sm text-sm lg:text-base">
                        <h3 className="font-semibold  ml-1 flex-1">Giá khám: </h3>
                        <span className="w-1/2 text-center text-wrap">{amount}</span>
                    </Row>
                    <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 shadow-sm text-sm lg:text-base">
                        <h3 className="font-semibold  ml-1 text-wrap flex-1">Dịch vụ khám: </h3>
                        <span className="w-1/2 text-center text-wrap">{orderItem.service_name}</span>
                    </Row>
                    <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 shadow-sm text-sm lg:text-base">
                        <h3 className="font-semibold  ml-1">Ngày khám</h3>
                        <span className="w-1/2 text-center text-wrap">{dayjs(orderItem.time_order).format("DD/MM/YYYY")}</span>
                    </Row>
                    <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 shadow-sm text-sm lg:text-base">
                        <h3 className="font-semibold  ml-1">Trạng thái: </h3>
                        <span className="w-1/2 text-center text-wrap">
                            <Tag color={paymentStatus[orderItem.payment_status].color}>
                                {paymentStatus[orderItem.payment_status].text}
                            </Tag>
                        </span>
                    </Row>
                    <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 text-sm lg:text-base">
                        <h3 className="font-semibold  ml-1">Hành động:</h3>
                        <div className="w-1/2 flex justify-center gap-2 text-center">
                            <Tooltip title="Xem chi tiết">
                                <EyeOutlined onClick={onOpenModal} className="hover:!text-blue-800 !text-blue-500 !text-base !cursor-pointer" />
                            </Tooltip>
                            {orderItem.payment_status === "UNPAID" && (
                                <>
                                    <Tooltip title="Hủy phiếu khám">
                                        <Spin spinning={loadingCancel} indicator={<LoadingOutlined />}>
                                            <CloseCircleOutlined onClick={onCancelPayingOrder} className="!text-red-500 hover:!text-red-800 !text-base !cursor-pointer" />
                                        </Spin>
                                    </Tooltip>
                                    <Tooltip title="Thanh toán lại">
                                        <CreditCardOutlined className="hover:!text-purple-800 text-purple-500 !text-base !cursor-pointer" />
                                    </Tooltip>
                                </>
                            )}
                        </div>
                    </Row>
                </Col>
            </div>
        </>
    )
}

export default CartItem;