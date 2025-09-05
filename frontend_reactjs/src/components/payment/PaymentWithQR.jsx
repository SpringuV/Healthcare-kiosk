import { useEffect, useState } from "react"
import CountdownTimer from '../Modal/countdown_timer'
import { usePatientRegister } from "../context/patient_register_context"
import { useNavigate } from "react-router-dom"
import { usePaymentAgain } from "../context/payment_again_context"
import { useStateStep } from "../context/state_step_context"
import { WS_URL } from "../../data/port"

function PaymentWithQR() {
    const navigate = useNavigate()
    const [showButtonReturn, setShowButtonReturn] = useState(false)
    const [showTimeDown, setShowTimeDown] = useState(true)
    const [textSuccess, setTextSuccess] = useState("")
    const { paymentAgain } = usePaymentAgain()
    const { flowType, setStateStep } = useStateStep()
    const handleShowButtonReturn = () => {
        setShowButtonReturn(true)
    }

    const [isFailPayment, setIsFailPayment] = useState(false)
    const { patientRegister } = usePatientRegister()
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
        navigate("/", { replace: true })
        window.history.pushState(null, null, "/")
        window.onpopstate = () => {
            navigate("/", { replace: true })
        }
    }

    useEffect(() => {
        if(flowType === "non-insurance"){
            setStateStep(3)
        }
    }, [flowType, setStateStep])

    useEffect(() => {
        // Tạo kết nối tới WebSocket backend
        const ws = new WebSocket(`${WS_URL}/ws/checkTransfer`);
        ws.onopen = () => {
            console.log("Kết nối WebSocket thành công");
            // Gửi order_id sang backend
            const orderId = patientRegister?.order_id || paymentAgain?.info_order?.order_id;
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
    }, [patientRegister?.order_id, paymentAgain?.info_order?.order_id]);

    // VQRQADTJG7282
    // 962471907021002

    const payment = {
        order_id: patientRegister.order_id ? patientRegister.order_id : paymentAgain.info_order.order_id,
        amount: Math.round(patientRegister.price ? patientRegister.price * 26181 : paymentAgain.info_order.price * 26181),
    }

    return (
        <>
            <div className="flex flex-col md:grid md:grid-cols-2 px-[7%] gap-3">
                <div>
                    <h1 className="text-center text-[20px] md:text-[25px] font-bold mb-2">Mã QR chuyển khoản ngân hàng</h1>
                    <div className="w-full flex justify-center">
                        {(patientRegister?.order_id || paymentAgain?.info_order?.order_id) && (<img key={payment.amount} className="w-60 md:w-fit h-auto" src={`https://qr.sepay.vn/img?acc=VQRQADTJG7282&bank=MBBank&amount=${payment.amount}&des=ORDER${payment.order_id}`}></img>)}
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
                                {isFailPayment ? (
                                    <button className=' text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700' onClick={handleConfirmAndReturnHome}>Quay trở về trang chủ</button>
                                ) : (
                                    <button className=' text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700' onClick={handleConfirmRegistration} type='button' >In phiếu và Xác nhận</button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
export default PaymentWithQR