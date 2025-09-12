import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useGlobalContext } from "../context/provider"
import { Helmet } from "react-helmet-async"
import { Modal } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"
import { select_patient_booking_service_data } from "../../reducers"
function PaymentControl() {
    const button = ['Tiền mặt', 'Chuyển khoản']
    const info = ['|Thanh toán bằng tiền mặt tại quầy|', '|Chuyển khoản ngân hàng thông qua mã QR|']
    const navigate = useNavigate()
    const patient_booking_service = useSelector(select_patient_booking_service_data)
    const { stateStep, setStateStep, paymentAgain, setFlowType } = useGlobalContext()
    const has_data = (paymentAgain && Object.keys(paymentAgain).length !== 0) || (patient_booking_service.citizen_id !== "" ? true : false)
    const [localLoading, setLocalLoading] = useState(false)
    const delay = [2000, 1500, 2500]
    useEffect(() => {
        setFlowType("non-insurance")
        if (stateStep !== 3) {
            setStateStep(3)
        }
    }, [stateStep, setStateStep, has_data, setFlowType])

    //  Auto play audio khi trang render
    useEffect(() => {
        if (has_data) {
            const audio = new Audio("/audio/choose_payment.mp3")
            audio.play().catch(err => {
                console.warn("Trình duyệt chặn autoplay, cần user interaction:", err)
            })
        }
    }, [has_data])

    const handleChange = (text) => {
        setLocalLoading(true)
        setTimeout(() => {
            if (text === "Tiền mặt") {
                navigate('/non-insur/confirm-registration')
            } else {
                navigate('/non-insur/banking')
            }
        }, delay[Math.floor(Math.random() * delay.length)])
    }
    const handleGoHome = () => {
        setLocalLoading(true)
        setTimeout(()=>{
            navigate('/')
        }, delay[Math.floor(Math.random() * delay.length)])
    }
    return (
        <>
            <Helmet>
                <title>Chọn hình thức thanh toán</title>
            </Helmet>
            {has_data ? (
                <>
                    <Modal
                        footer={null}
                        open={localLoading}
                        closable={false}
                        maskClosable={false}
                        styles={{ body: { textAlign: "center" } }}
                        centered
                    >
                        <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                        <div className="text-lg font-semibold loading-dots">Đang xử lý, vui lòng chờ</div>
                    </Modal>
                    <div className='text-center px-7 py-8 rounded-lg'>
                        <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                            <h1>CHỌN HÌNH THỨC THANH TOÁN</h1>
                        </div>
                        <div className='flex justify-center'>
                            <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                                {button.map((text, i) => (
                                    <div key={i} className='flex m-2 h-full w-1/2' onClick={() => handleChange(text)}>
                                        <div className='flex flex-col items-center justify-start h-[80%] w-full hover:scale-105 transition-all duration-500 ease-in-out'>
                                            <div className='w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                                <button className='cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]'>{text}</button>
                                            </div>
                                            <div className="mt-2 text-center text-gray-400">
                                                {info[i]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='text-center px-7 py-8 rounded-lg min-h-screen flex flex-col justify-start items-center'>
                    <div className='mb-6 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>KHÔNG CÓ DỮ LIỆU THANH TOÁN</h1>
                    </div>
                    <div className='mb-8 text-gray-600 text-[16px] lg:text-[18px]'>
                        <p>Vui lòng thực hiện đăng ký dịch vụ trước khi thanh toán</p>
                    </div>
                    <div className='w-full sm:w-[400px] lg:w-[500px]'>
                        <button
                            onClick={handleGoHome}
                            className='w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 hover:scale-105 transition-all duration-300 ease-in-out p-4 text-[16px] sm:text-[18px] font-semibold lg:text-[20px]'
                        >
                            Quay về trang chủ
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default PaymentControl