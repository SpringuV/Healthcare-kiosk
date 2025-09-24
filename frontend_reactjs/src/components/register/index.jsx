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
function RegisterPage() {
    const button = ['Bảo hiểm y tế', 'Dịch vụ']
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
            if (text === "Bảo hiểm y tế") {
                navigate('/insur')
            } else if (text === "Dịch vụ") {
                navigate('/non-insur')
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
                <title>Lựa chọn hình thức khám</title>
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
                <div className='text-center px-7 py-8 rounded-lg'>
                    <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>Lựa chọn hình thức khám</h1>
                    </div>
                    <div className='flex justify-center'>
                        <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                            {button.map((text, i) => (
                                <div key={i} className='flex m-2 h-full w-1/2' onClick={() => handleChange(text)}>
                                    <div className='flex items-center justify-center h-[80%] w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 hover:scale-105 transition-all duration-500 ease-in-out'>
                                        <button className='cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px] '>{text}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Nút dưới cùng */}
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-fit px-4">
                    <div
                        onClick={() => navigate("/")}
                    >
                        <div className="flex px-10 items-center justify-center bg-gradient-to-r from-colorTwo to-colorFive text-black rounded-xl 
                                        hover:from-green-500 hover:to-emerald-600 hover:scale-105 
                                        transition-all duration-500 ease-in-out">
                        <button className="text-white cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]">
                            Trở lại
                        </button>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default RegisterPage