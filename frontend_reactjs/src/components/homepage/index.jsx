import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clear_history_booking, clear_insurance_check, clear_patient_exist_check, clear_patient_register } from '../../actions/patient'
import { clear_booking_service } from '../../actions/service'
import { Helmet } from "react-helmet-async"
import { useGlobalContext } from '../context/provider'
import { clearToken } from '../../utils/token'
import { Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
function HomePage() {
    const button = ['Lấy số', 'Đăng ký khám', 'Đăng ký mở bảo hiểm', 'Ngân hàng số 24/7', 'Liên thông hồ sơ bệnh án (CCCD/VNEID)', 'Bản đồ', 'Tra cứu']
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { clearStateStepAndFlowType, clearPaymentAgain, clearPatientRegister } = useGlobalContext()
    const [localLoading, setLocalLoading] = useState(false)

    useEffect(() => {
        dispatch(clear_patient_register())
        dispatch(clear_insurance_check())
        dispatch(clear_patient_exist_check())
        dispatch(clear_booking_service())
        dispatch(clear_history_booking())
        clearStateStepAndFlowType()
        clearToken()
        clearPaymentAgain()
        clearPatientRegister()

    }, [dispatch])

    const handleChange = (text) => {
        setLocalLoading(true)
        const delay = [1000, 2000]
        setTimeout(() => {
            if (text === "Đăng ký khám") {
                navigate('/register')
            } else if (text === "Tra cứu") {
                navigate('/result-search')
            }
            setLocalLoading(false)
        }, delay[Math.floor(Math.random() * delay.length)])
    }

    useEffect(() => {
        // Thay thế lịch sử hiện tại bằng HomePage, xóa lịch sử trước đó
        window.history.replaceState(null, document.title, window.location.pathname);
        // Xử lý khi người dùng nhấn quay lại
        const handlePopState = () => {
            // Thêm một mục lịch sử giả để ngăn quay lại
            window.history.pushState(null, document.title, window.location.pathname);
            // Ngăn hành vi mặc định của trình duyệt
            return false;
        }
        window.addEventListener('popstate', handlePopState);
        // Cleanup khi component unmount
        return () => {
            window.removeEventListener('popstate', handlePopState);
        }
    }, []) // Chạy một lần khi mount

    return (
        <>
            <Helmet>
                <title>Trang chủ</title>
            </Helmet>
            {/* modal load */}
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Đang xử lý, vui lòng chờ</div>
            </Modal>
            <div className={`transition-all duration-300 ${localLoading ? 'blur-sm !bg-white/20' : ''}`}>
                <div className='text-center px-7 py-8 rounded-lg h-full'>
                    <div className='mb-7 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>Chào mừng bạn tới KIOSK phục vụ tự động vui lòng chọn dịch vụ bạn muốn thực hiện!</h1>
                    </div>
                    <div className="flex justify-center w-full h-full">
                        <div className="grid w-fit grid-cols-2 gap-6 h-full">
                            {button.map((text, i) => (
                            <div
                                key={i}
                                onClick={() => handleChange(text)}
                                className="flex h-28 w-full"
                            >
                                <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 hover:scale-105 transition-all duration-500 ease-in-out">
                                <button className="cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]">
                                    {text}
                                </button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage