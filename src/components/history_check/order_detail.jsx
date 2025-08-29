import { Descriptions, Modal, Tag } from "antd"
import dayjs from "dayjs"

function OrderDetail(props) {
    const {order} = props
    // Kiểm tra nếu không có dữ liệu
    if (!order) {
        return <div>Không tìm thấy thông tin đơn hàng</div>;
    }
    return (
        <>
            <Descriptions colon={true} bordered={true} column={{xs:1, sm:1, md:2, lg:2, xl:2, xxl:2}}>
                <Descriptions.Item label="Mã phiếu">{order.order_id}</Descriptions.Item>
                <Descriptions.Item label="Thời gian">{dayjs(order.time_order).format("DD/MM/YYYY")}</Descriptions.Item>
                <Descriptions.Item label="Số phiếu đợi">{order.queue_number}</Descriptions.Item>
                <Descriptions.Item label="Dịch vụ">{order.service_name}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ phòng">{order.address_room}</Descriptions.Item>
                <Descriptions.Item label="Bác sĩ">{order.doctor_name}</Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">{order.payment_method}</Descriptions.Item>
                <Descriptions.Item label="Giá tiền">{Math.round((order.price * 26181)).toLocaleString() + " đ"}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={order.payment_status === "PAID" ? "green" : order.payment_status === "UNPAID" ? "geekblue" : "volcano"}>
                        {order.payment_status === "PAID" ? "Đã thanh toán" : order.payment_status === "UNPAID" ? "Chưa thanh toán" : "Đã hủy"}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        </>
    )
}

export default OrderDetail