import { CloseCircleOutlined, CreditCardOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons"
import { Col, Row, Spin, Tag, Tooltip } from "antd"
import dayjs from "dayjs"

function CartItem(props) {
    const { orderItem, onOpenModal} = props;
    const amount = Math.round(orderItem.price * 26181).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    const paymentStatus = {
        CANCELLED: { text: "Đã hủy", color: "red" },
        PAID: { text: "Đã thanh toán", color: "green" },
        UNPAID: { text: "Chưa thanh toán", color: "purple" },
    }
    return (
        <>
            <Tooltip title="Click để xem chi tiết">
                <div className="hover:bg-blue-100 focus:bg-blue-100 bg-slate-50">
                    <Col onClick={onOpenModal} xs={24} sm={24} md={24} lg={24} xl={24} className="p-1 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                        <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 shadow-sm text-sm lg:text-base">
                            <h3 className="font-semibold  ml-1 text-wrap flex-1">Dịch vụ khám: </h3>
                            <span className="w-1/2 text-center text-wrap">{orderItem.service_name}</span>
                        </Row>
                        <Row gutter={[16, 16]} className="w-full flex justify-between items-center py-1 pl-2 gap-3 shadow-sm text-sm lg:text-base">
                            <h3 className="font-semibold  ml-1 flex-1">Giá khám: </h3>
                            <span className="w-1/2 text-center text-wrap">{amount}</span>
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
                        
                    </Col>
                </div>
            </Tooltip>
        </>
    )
}
export default CartItem;