import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "../context/form_context"
import { useInsurrance } from "../context/insurrance_context"

function PaymentWithQR() {
    const location = useLocation()
    const state = location.state

    const today = new Date()
    const formattedDate = today.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })

    const navigate = useNavigate()
    const { clearFormData } = useForm()
    const { clearInsuranceInfo } = useInsurrance()

    const handleConfirmAndReturnHome = () => {
        clearFormData?.()
        clearInsuranceInfo?.()
        navigate('/', { replace: true })
        window.history.pushState(null, null, '/')
        window.onpopstate = () => {
            navigate('/', { replace: true }) // Ngăn back điều hướng về trang chủ, replace: true là Thay thế trang hiện tại trong lịch sử trình duyệt thay vì thêm một mục mới. 
            //         Khi bạn không muốn người dùng quay lại trang cũ (ví dụ: form đã submit xong).
            // Khi điều hướng sau một hành động hoàn tất như:
            // Đăng nhập
            // Đăng ký thành công
            // Xác nhận thông tin
            // Hoàn tất thanh toán, v.v
        }
    }
    return (
        <>
            <div className="flex flex-col md:grid md:grid-cols-2 px-[7%] gap-3">
                <div>
                    <h1 className="text-center text-[20px] md:text-[25px] font-bold mb-2">Mã QR chuyển khoản ngân hàng</h1>
                    <div className="w-full flex justify-center">
                        <img className="w-60 md:w-fit h-auto" src="https://qr.sepay.vn/img?acc=VQRQADTJG7282&bank=MBBank&amount=100000&des=ORDER30"></img>
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
                            <div>12345556666</div>
                            <div>MB Bank</div>
                            <div>{state.is_insurrance ? (`${(state.price * 26181).toLocaleString('vi-VN')} VNĐ`) : (`${(state.price_insur * 26181).toLocaleString('vi-VN')} VNĐ`)}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="text-center text-[20px] md:text-[25px] font-bold mb-2">Thông tin</h1>
                    <ul className="flex flex-col justify-center mx-[5%]">
                        <li><span className="font-semibold">Mã đơn hàng:</span> {state.order_id}</li>
                        <li><span className="font-semibold">Ngày:</span> {formattedDate}</li>
                        <li><span className="font-semibold mr-2">Tổng tiền:</span>{state.is_insurrance ? (`${(state.price * 26181).toLocaleString('vi-VN')} VNĐ`) : (`${(state.price_insur * 26181).toLocaleString('vi-VN')} VNĐ`)}</li>
                        <li><span className="font-semibold">Phương thức thanh toán:</span> Chuyển khoản ngân hàng (Quét QR)</li>
                    </ul>
                    <div className="flex justify-center items-center mt-2">
                        <button className=' text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700' onClick={handleConfirmAndReturnHome} type='button' >Xác nhận và về trang chủ</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PaymentWithQR