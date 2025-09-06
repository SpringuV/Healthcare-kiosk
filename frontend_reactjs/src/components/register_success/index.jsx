import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { patient_get_qr_code } from '../../services/patient'
import { useSelector } from 'react-redux'
import { select_patient_booking_service_data } from '../../reducers'
import { useDispatch } from 'react-redux'
import { clear_insurance_check, clear_patient_exist_check } from '../../actions/patient'
import { clear_booking_service } from '../../actions/service'
import { useGlobalContext } from '../context/provider'
function RegisterSuccess() {
    const [qrCode, setQrCode] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { flowType, setStateStep, clearStateStepAndFlowType, paymentAgain } = useGlobalContext()
    const patient_booking_service_data = useSelector(select_patient_booking_service_data)
    useEffect(() => {
        if (flowType === "insurance") {
            setStateStep(3)
        } else if (flowType === "non-insurance") {
            setStateStep(4)
        }
    }, [flowType, setStateStep])

    const handleReturnHomeInsur = () => {
        dispatch(clear_insurance_check())
        dispatch(clear_patient_exist_check())
        dispatch(clear_booking_service())
        clearStateStepAndFlowType()
        navigate("/", { replace: true })
        window.history.pushState(null, null, "/")
        window.onpopstate = () => {
            navigate("/", { replace: true })
        }
    }

    const displayInfoRegister = {
        fullname: patient_booking_service_data?.fullname ?? paymentAgain?.info_user?.fullname,
        gender: patient_booking_service_data?.gender ?? paymentAgain?.info_user?.gender,
        dob: patient_booking_service_data?.dob ?? paymentAgain?.info_user?.dob,
        service_name: patient_booking_service_data?.service_name ?? paymentAgain?.info_order?.service_name,
        citizen_id: patient_booking_service_data?.citizen_id ?? paymentAgain?.info_user?.citizen_id,
        address_room: patient_booking_service_data?.address_room ?? paymentAgain?.info_order?.address_room,
        doctor_name: patient_booking_service_data?.doctor_name ?? paymentAgain?.info_order?.doctor_name,
        queue_number: patient_booking_service_data?.queue_number ?? paymentAgain?.info_order?.queue_number,
        is_insurrance: patient_booking_service_data?.is_insurrance ?? paymentAgain?.info_user?.is_insurrance,
        time_order: patient_booking_service_data?.time_order ?? paymentAgain?.info_order?.time_order,
        price: patient_booking_service_data?.price ?? paymentAgain?.info_order?.price,
    }

    useEffect(() => {
        const fetchQRCode = async () => {
            const orderId = patient_booking_service_data?.order_id || paymentAgain?.info_order?.order_id
            if (orderId) {
                const res = await patient_get_qr_code(orderId)
                setQrCode(res.data.QRCode) // API trả về { order_id, QRCode }
            }
        }
        fetchQRCode()
    }, [patient_booking_service_data, paymentAgain])

    return (
        <>
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
                            ['Ngày đăng kí:', new Date(displayInfoRegister.time_order).toLocaleString()],
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
                        <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className='rounded-lg' width={150} height={150} />
                    </div>
                    <div className=' flex justify-center items-center px-5 py-3'>
                        <button className=' text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700'
                            onClick={handleReturnHomeInsur}
                            type='button' >Xác nhận và quay về trang chủ</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterSuccess