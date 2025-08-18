import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
function RegisterSuccess() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state

    const context = useOutletContext()
    // eslint-disable-next-line no-unused-vars
    const { stateStep, setStateStep } = context || {}
    
    useEffect(() => {
        setStateStep?.(3) // Step cho chọn dịch vụ
    }, [setStateStep])
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
                            ['Họ và tên:', state.fullname],
                            ['Giới tính:', state.gender],
                            ['Ngày sinh:', state.dob],
                            ['Dịch vụ khám:', state.service_name],
                            ['CCCD:', state.citizen_id],
                            ['Phòng khám:', state.address_room],
                            ['Bác sĩ:', state.doctor_name],
                            ['Số phiếu đợi:', state.queue_number],
                            ['Bảo hiểm y tế:', state.is_insurrance ? 'Có' : 'Không'],
                            ['Ngày đăng kí:', new Date(state.time_order).toLocaleString()],
                            ['Giá khám dịch vụ:', `${(state.price * 26181).toLocaleString('vi-VN')} VNĐ`, state.is_insurrance === "Không" ? true : false ],
                            ['Giá khám bảo hiểm:', `${(state.price_insur * 26181).toLocaleString('vi-VN')} VNĐ`, state.is_insurrance === "Có" ? true : false],
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
                        <img src={`data:image/png;base64,${state.QRCode}`} alt="QR Code" className='rounded-lg' width={150} height={150} />
                    </div>
                    <div className=' flex justify-center items-center px-5 py-3'>
                        <button className='text-[17px] text-white font-medium px-10 py-2 rounded-xl bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600' type='button' onClick={()=> navigate('/payment', {state: state})}>THANH TOÁN</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterSuccess