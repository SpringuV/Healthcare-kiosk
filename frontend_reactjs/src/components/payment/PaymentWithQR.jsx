import { useEffect, useState } from "react"
import CountdownTimer from '../Modal/countdown_timer'
import { useNavigate } from "react-router-dom"
import { WS_URL } from "../../data/port"
import { useSelector } from "react-redux"
import { select_patient_booking_service_data } from "../../reducers"
import { useGlobalContext } from "../context/provider"
import { Helmet } from "react-helmet-async"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
function PaymentWithQR() {
    const navigate = useNavigate()
    const [showButtonReturn, setShowButtonReturn] = useState(false)
    const [showTimeDown, setShowTimeDown] = useState(true)
    const [textSuccess, setTextSuccess] = useState("")
    const { flowType, setStateStep, paymentAgain } = useGlobalContext()
    const is_payment_again = paymentAgain && Object.keys(paymentAgain).length !== 0
    const [localLoading, setLocalLoading] = useState(false)

    const handleShowButtonReturn = () => {
        setShowButtonReturn(true)
    }

    const [isFailPayment, setIsFailPayment] = useState(false)
    const patient_booking_service = useSelector(select_patient_booking_service_data)
    const today = new Date()
    const formattedDate = today.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })

    const handleConfirmRegistration = () => {
        navigate("/non-insur/confirm-registration")
    }


    const handleConfirmAndReturnHome = () => {
        if (is_payment_again) {
            // Nếu là thanh toán lại, chỉ quay về trang trước
            navigate(-1)
        } else {
            // Nếu là flow mới, về trang chủ
            navigate("/", { replace: true })
            window.history.pushState(null, null, "/")
            window.onpopstate = () => {
                navigate("/", { replace: true })
            }
        }
    }
    useEffect(() => {
        // Debug: Log state để kiểm tra
        console.log("Current Redux state:", {
            patient_booking_service,
            paymentAgain,
            is_payment_again
        })
    }, [patient_booking_service, paymentAgain, is_payment_again])

    useEffect(() => {
        if (flowType === "non-insurance") {
            setStateStep(3)
        }
    }, [flowType, setStateStep])

    useEffect(() => {
        // Tạo kết nối tới WebSocket backend
        const ws = new WebSocket(`${WS_URL}/ws/checkTransfer`);
        ws.onopen = () => {
            console.log("Kết nối WebSocket thành công");
            // Gửi order_id sang backend
            const orderId = patient_booking_service?.order_id || paymentAgain?.info_order?.order_id;
            if (orderId) {
                ws.send(JSON.stringify({ order_id: orderId }));
            }
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Nhận từ server:", data);

            //hiện trạng thái thanh toán
            if (data.result) {
                setTextSuccess("Bạn đã thanh toán thành công, vui lòng trở lại trang chủ !")
                setShowTimeDown(false)
                setShowButtonReturn(true)
                ws.close(); // Đóng socket khi đã có kết quả
            }
        };
        ws.onclose = () => {
            console.log("WebSocket đã đóng");
        };
        ws.onerror = (error) => {
            console.error("Lỗi WebSocket:", error);
        };
        // cleanup khi component unmount
        return () => {
            ws.close();
        };
    }, [patient_booking_service?.order_id, paymentAgain?.info_order?.order_id]);
    // VQRQADTJG7282
    // 962471907021002
    const payment = {
        order_id: patient_booking_service.order_id ? patient_booking_service.order_id : paymentAgain.info_order.order_id,
        amount: Math.round(patient_booking_service.price ? patient_booking_service.price * 26181 : paymentAgain.info_order.price * 26181),
    }

    return (
        <>
            <Helmet>
                <title>Thanh toán QR</title>
            </Helmet>
            <div className="flex flex-col md:grid md:grid-cols-2 px-[7%] gap-3">
                <div>
                    <h1 className="text-center text-[20px] md:text-[25px] font-bold mb-2">Mã QR chuyển khoản ngân hàng</h1>
                    <div className="w-full flex justify-center">
                        {(patient_booking_service?.order_id || paymentAgain?.info_order?.order_id) && (<img key={payment.amount} className="w-60 md:w-fit h-auto" src={`https://qr.sepay.vn/img?acc=VQRQADTJG7282&bank=MBBank&amount=${payment.amount}&des=ORDER${payment.order_id}`}></img>)}
                    </div>
                    <h1 className="text-center font-bold text-[20px]">Thông tin chuyển khoản ngân hàng</h1>
                    <div className="grid grid-cols-2">
                        <div className="text-right mr-2 font-semibold">
                            <h3>Tên tài khoản</h3>
                            <h3>Số tài khoản</h3>
                            <h3>Ngân hàng</h3>
                            <h3>Số tiền</h3>
                        </div>
                        <div className="text-left ml-2">
                            <div>NGUYEN NGO AN</div>
                            <div>VQRQADTJG7282</div>
                            <div>MB Bank</div>
                            <div>{(payment.amount).toLocaleString('vi-VN')} VNĐ</div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="text-center text-[20px] md:text-[25px] font-bold mb-2">Thông tin</h1>
                    <ul className="flex flex-col justify-center mx-[5%]">
                        <li><span className="font-semibold">Mã đơn hàng:</span> {payment.order_id}</li>
                        <li><span className="font-semibold">Ngày:</span> {formattedDate}</li>
                        <li><span className="font-semibold mr-2">Tổng tiền:</span>{`${(payment.amount).toLocaleString('vi-VN')} VNĐ`}</li>
                        <li><span className="font-semibold">Phương thức thanh toán:</span> Chuyển khoản ngân hàng (Quét QR)</li>
                    </ul>
                    {/* time countdown */}
                    {showTimeDown && (
                        <CountdownTimer minutes={5} onTimeout={() => {
                            handleShowButtonReturn()
                            setTextSuccess("Thanh toán thất bại !, Hết thời gian thanh toán ! Giao dịch tạm tính là chưa thanh toán, bạn vui lòng quay về trang chủ, vào mục tra cứu lịch sử để hủy giao dịch rồi sau đó đăng kí lại dịch vụ")
                            setIsFailPayment(true)
                            setShowTimeDown(false)
                        }} onSuccess={handleShowButtonReturn} success={showButtonReturn} />
                    )}

                    {showButtonReturn && (
                        <>
                            <h1 className={`italic ${isFailPayment ? " text-red-700 " : " text-green-700 "} text-center`}>{textSuccess}</h1>
                            <div className="flex justify-center items-center mt-2">
                                <Spin spinning={localLoading} indicator={<LoadingOutlined />}>
                                    {isFailPayment ? (
                                        <button
                                            disabled={localLoading}
                                            className='text-center text-base lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700'
                                            onClick={() => {
                                                const delay = [2000, 3000, 4000, 5000, 6000, 7000]
                                                setLocalLoading(true)
                                                setTimeout(() => {
                                                    handleConfirmAndReturnHome()
                                                    setLocalLoading(false)
                                                }, delay[Math.floor(Math.random() * delay.length)])
                                            }}>
                                            {localLoading === true ? "Đang xử lý ..." : "Quay về trang chủ"}
                                        </button>
                                    ) : (
                                        <button
                                            disabled={localLoading}
                                            className='text-center text-base lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700'
                                            onClick={() => {
                                                const delay = [2000, 3000, 4000, 5000, 6000, 7000]
                                                setLocalLoading(true)
                                                setTimeout(() => {
                                                    handleConfirmRegistration()
                                                    setLocalLoading(false)
                                                }, delay[Math.floor(Math.random() * delay.length)])
                                            }}
                                            type='button' >
                                            {localLoading === true ? "Đang xử lý ..." : "Bước tiếp theo: Xác nhận đăng kí khám"}
                                        </button>
                                    )}
                                </Spin>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
export default PaymentWithQR