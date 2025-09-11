import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clear_history_booking, clear_insurance_check, clear_patient_exist_check, clear_patient_register } from '../../actions/patient'
import { clear_booking_service } from '../../actions/service'
import { Helmet } from "react-helmet-async"
import { useGlobalContext } from '../context/provider'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
function HomePage() {
    const button = ['Khám bảo hiểm y tế', 'Khám dịch vụ']
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { clearStateStepAndFlowType } = useGlobalContext()
    const [localLoading, setLocalLoading] = useState(false)

    useEffect(() => {
        dispatch(clear_patient_register())
        dispatch(clear_insurance_check())
        dispatch(clear_patient_exist_check())
        dispatch(clear_booking_service())
        dispatch(clear_history_booking())
        clearStateStepAndFlowType()

    }, [dispatch, clearStateStepAndFlowType])

    const handleChange = (text) => {
        setLocalLoading(true)
        const delay = [1000, 2000, 3000]
        setTimeout(() => {
            if (text === "Khám bảo hiểm y tế") {
                navigate('/insur')
            } else if (text === "Khám dịch vụ") {
                navigate('/non-insur')
            } else {
                navigate("/result-search")
            }
            setLocalLoading(false)
        }, delay[Math.floor(Math.random() * delay.length)])
    }
    return (
        <>
            <Helmet>
                <title>Trang chủ</title>
            </Helmet>
            <Spin
                className='fixed z-50 inset-0 flex gap-5 justify-center items-center bg-blur-sm'
                spinning={localLoading}
                fullscreen
                size='large'
                indicator={<LoadingOutlined className='text-white' spin />}
                tip={<span className='text-2xl  font-semibold text-white'>Đang xử lý ...</span>}
            />
            <div className={`transition-all duration-300 ${localLoading ? 'blur-sm !bg-white/20' : ''}`}>
                <div className='text-center px-7 py-8 rounded-lg'>
                    <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>CHỌN HÌNH THỨC KHÁM</h1>
                    </div>
                    <div className='flex justify-center'>
                        <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                            {button.map((text, i) => (
                                <div key={i} className='flex m-2 h-full w-1/2' onClick={() => handleChange(text)}>
                                    <div className='flex items-center justify-center h-[80%] w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                        <button className='cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]'>{text}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='my-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>DỊCH VỤ KHÁC</h1>
                    </div>
                    <div className='flex w-full h-10 justify-center items-center gap-1'>
                        <div className='flex items-center justify-center h-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                            <button className='px-5 py-1 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]' onClick={() => handleChange("Tra cứu lịch sử khám")}>Tra cứu lịch sử khám</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage