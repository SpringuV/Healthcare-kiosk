import { useNavigate } from 'react-router-dom'
import { usePatientRegister } from '../context/patient_register_context'
import { useStateStep } from '../context/state_step_context'
import { useEffect } from 'react'
import { useForm } from '../context/form_context'
import { useInsurrance } from '../context/insurrance_context'
function RegisterSuccess() {
    const navigate = useNavigate()
    const { patientRegister, clearPatientRegister } = usePatientRegister()
    const { flowType, setStateStep, clearStateStepAndFlowType } = useStateStep()
    const { clearFormData } = useForm()
    const { clearInsuranceInfo } = useInsurrance()
    console.log(patientRegister)
    useEffect(() => {
        if (flowType === "insurance") {
            setStateStep(3)
        } else if (flowType === "non-insurance") {
            setStateStep(4)
        }
    }, [flowType, setStateStep])

    const handleReturnHomeInsur = () => {
        clearStateStepAndFlowType()
        clearPatientRegister()
        clearFormData()
        clearInsuranceInfo()
        navigate("/", { replace: true })
        window.history.pushState(null, null, "/")
        window.onpopstate = () => {
            navigate("/", { replace: true })
        }
    }

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
                            ['Họ và tên:', patientRegister.fullname],
                            ['Giới tính:', patientRegister.gender],
                            ['Ngày sinh:', patientRegister.dob],
                            ['Dịch vụ khám:', patientRegister.service_name],
                            ['CCCD:', patientRegister.citizen_id],
                            ['Phòng khám:', patientRegister.address_room],
                            ['Bác sĩ:', patientRegister.doctor_name],
                            ['Số phiếu đợi:', patientRegister.queue_number],
                            ['Bảo hiểm y tế:', patientRegister.is_insurrance ? 'Có' : 'Không'],
                            ['Sử dụng bảo hiểm y tế:', patientRegister.use_insurrance ? 'Có' : 'Không'],
                            ['Ngày đăng kí:', new Date(patientRegister.time_order).toLocaleString()],
                            ['Giá khám:', `${Math.round(patientRegister.price * 26181).toLocaleString('vi-VN')} VNĐ`],
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
                        <img src={`data:image/png;base64,${patientRegister.QRCode}`} alt="QR Code" className='rounded-lg' width={150} height={150} />
                    </div>
                    <div className=' flex justify-center items-center px-5 py-3'>
                        <button className=' text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700' onClick={handleReturnHomeInsur} type='button' >Xác nhận và quay về trang chủ</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterSuccess