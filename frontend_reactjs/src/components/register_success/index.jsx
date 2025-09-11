import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { patient_get_qr_code } from '../../services/patient'
import { useSelector } from 'react-redux'
import { select_patient_booking_service_data } from '../../reducers'
import { useGlobalContext } from '../context/provider'
import { Helmet } from 'react-helmet-async'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
function RegisterSuccess() {
    const [qrCode, setQrCode] = useState("")
    const navigate = useNavigate()
    const { flowType, setStateStep, paymentAgain } = useGlobalContext()
    const patient_booking_service_data = useSelector(select_patient_booking_service_data)
    const [localLoading, setLocalLoading] = useState(false)
    const [countDownTime, setCountDownTime] = useState(30)
    useEffect(() => {
        if (flowType === "insurance") {
            setStateStep(3)
        } else if (flowType === "non-insurance") {
            setStateStep(4)
        }
    }, [flowType, setStateStep])

    const is_payment_again = paymentAgain && Object.keys(paymentAgain).length !== 0
    const handleReturnHomeInsur = () => {
        if (is_payment_again) {
            navigate("/result")
        } else {
            navigate("/", { replace: true })
        }
    }

    //  Auto play audio khi trang render
    useEffect(() => {
        const audio = new Audio("/audio/last_step.mp3")
        audio.play().catch(err => {
            console.warn("Trình duyệt chặn autoplay, cần user interaction:", err)
        })
    }, [])

    useEffect(() => {
        if (countDownTime <= 0) {
            if (is_payment_again) {
                navigate("/result")
            } else {
                navigate("/", { replace: true })
            }
            return
        }
        const timer = setTimeout(() => {
            setCountDownTime(previous => previous - 1)
        }, 1000)
        return () => clearTimeout(timer) // cleanup khi component unmount
    }, [navigate, countDownTime, is_payment_again])

    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault()
            if (is_payment_again) {
                // Nếu là thanh toán lại, cho phép quay về trang trước
                navigate(-1)
            } else {
                // Nếu không phải thanh toán lại, luôn về trang chủ
                navigate("/", { replace: true })
            }
        }
        window.addEventListener("popstate", handlePopState)
        return () => {
            window.removeEventListener("popstate", handlePopState)
        }
    }, [navigate, is_payment_again])

    const fallback = (val, alt) => {
        if (val === null || val === undefined || val === "") return alt
        return val
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleString("vi-VN")
    }
    const displayInfoRegister = {
        fullname: fallback(patient_booking_service_data?.fullname, paymentAgain?.info_user?.fullname),
        gender: fallback(patient_booking_service_data?.gender, paymentAgain?.info_user?.gender),
        dob: fallback(patient_booking_service_data?.dob, paymentAgain?.info_user?.dob),
        service_name: fallback(patient_booking_service_data?.service_name, paymentAgain?.info_order?.service_name),
        citizen_id: fallback(patient_booking_service_data?.citizen_id, paymentAgain?.info_user?.citizen_id),
        address_room: fallback(patient_booking_service_data?.address_room, paymentAgain?.info_order?.clinic_name),
        doctor_name: fallback(patient_booking_service_data?.doctor_name, paymentAgain?.info_order?.doctor_name),
        queue_number: fallback(patient_booking_service_data?.queue_number, paymentAgain?.info_order?.queue_number),
        is_insurrance: fallback(patient_booking_service_data?.is_insurrance, paymentAgain?.info_user?.is_insurrance),
        time_order: fallback(patient_booking_service_data?.time_order, paymentAgain?.info_order?.time_order),
        price: fallback(patient_booking_service_data?.price, paymentAgain?.info_order?.price),
    }

    useEffect(() => {
        let isMounted = true;
        const fetchQRCode = async () => {
            const orderId = fallback(patient_booking_service_data?.order_id, paymentAgain?.info_order?.order_id)
            if (orderId) {
                try {
                    const res = await patient_get_qr_code(orderId)
                    if (isMounted) setQrCode(res.data.QRCode)
                } catch (err) {
                    console.error("Lỗi fetch QR code:", err)
                }
            }
        }
        fetchQRCode()
        return () => { isMounted = false }
    }, [patient_booking_service_data, paymentAgain])

    return (
        <>
            <Helmet>
                <title>Xác nhận đăng kí khám</title>
            </Helmet>
            {/* lớp phủ ngoài */}
            <div className='flex justify-center w-full my-3 py-3'>
                <div className='bg-white rounded-lg w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw] flex flex-col '>
                    {/* Header */}
                    <div className='bg-colorOne px-4 py-2 text-center text-white font-bold text-[16px] md:text-[18px] lg:text-[20px] rounded-t-lg'>
                        <h3>Xác nhận thông tin đăng kí</h3>
                    </div>

                    {/* Scrollable content */}
                    <div className='px-5 py-2 flex-1'>
                        <span className='flex justify-center items-center text-[18px] sm:text-[20px] md:text-[23px] lg:text-[25px] font-bold w-full mb-2'>PHIẾU KHÁM BỆNH</span>
                        {[
                            ['Họ và tên:', displayInfoRegister.fullname],
                            ['Giới tính:', displayInfoRegister.gender],
                            ['Ngày sinh:', displayInfoRegister.dob],
                            ['Dịch vụ khám:', displayInfoRegister.service_name],
                            ['CCCD:', displayInfoRegister.citizen_id],
                            ['Phòng khám:', displayInfoRegister.address_room],
                            ['Bác sĩ:', displayInfoRegister.doctor_name],
                            ['Số phiếu đợi:', displayInfoRegister.queue_number],
                            ['Bảo hiểm y tế:', displayInfoRegister.is_insurrance ? 'Có' : 'Không'],
                            // ['Sử dụng bảo hiểm y tế:', patientRegister.use_insurrance ? 'Có' : 'Không'],
                            ['Ngày đăng kí:', formatDate(displayInfoRegister.time_order)],
                            ['Giá khám:', `${Math.round(displayInfoRegister.price * 26181).toLocaleString('vi-VN')} VNĐ`],
                            // ['Giá khám dịch vụ:', `${Math.round(patientRegister.price * 26181).toLocaleString('vi-VN')} VNĐ`, patientRegister.is_insurrance === "Không" ? true : false],
                            // ['Giá khám bảo hiểm:', `${Math.round(patientRegister.price_insur * 26181).toLocaleString('vi-VN')} VNĐ`, patientRegister.is_insurrance === "Có" ? true : false],
                        ].map(([label, value, isItalic], index) => (
                            <div key={index} className='py-2 flex justify-between items-center border-b-2 text-[14px] md:text-[16px] lg:text-[18px]'>
                                <label>{label}</label>
                                <span className={`font-medium text-center ${isItalic ? " italic text-green-500" : ""}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                    {/* QR Code */}
                    <div className=' pt-3 flex flex-col items-center justify-center'>
                        <p className="text-center text-[16px] md:text-[17px] lg:text-[18px] font-medium mb-2">Quét mã QR để tải phiếu khám</p>
                        {qrCode ? (
                            <img alt="Mã QR phiếu khám bệnh" src={`data:image/png;base64,${qrCode}`} className="rounded-lg" width={150} height={150} />
                        ) : (
                            <p className="text-gray-500 italic">Đang tải mã QR...</p>
                        )}
                    </div>
                    <div className=' flex justify-center flex-col items-center px-5 py-3'>
                        <p className='text-green-700 text-base'>Trang sẽ tự động thoát sau: <span className='text-red-500'>{countDownTime}s</span></p>
                        <Spin spinning={localLoading} indicator={<LoadingOutlined />}>
                            <button className=' text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700'
                                onClick={() => {
                                    const delay = [3000, 4000, 5000]
                                    setLocalLoading(true)
                                    setTimeout(() => {
                                        handleReturnHomeInsur()
                                        setLocalLoading(false)
                                    }, delay[Math.floor(Math.random() * delay.length)])
                                }}
                                type='button' >{localLoading === true ? "Đang xử lý ..." : is_payment_again === true ? "Quay về trang trước" : "Xác nhận và quay về trang chủ"}</button>
                        </Spin>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterSuccess