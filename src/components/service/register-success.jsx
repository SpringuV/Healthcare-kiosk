import { useRef, useState } from 'react'
import { replace, useLocation, useNavigate } from 'react-router-dom'
import { useService } from '../context/service_context'
import { useInsurrance } from '../context/insurrance_context'
import { useForm } from '../context/form_context'
function RegisterSuccess() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state

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
            {/* lớp phủ ngoài */}
            <div className='flex justify-center w-full  my-3 py-3'>
                <div className='bg-white rounded-lg w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw] flex flex-col max-h-[90vh]'>
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
                            ['Giá khám dịch vụ:', `${(state.price * 26181).toLocaleString('vi-VN')} VNĐ`],
                            ['Giá khám bảo hiểm:', `${(state.price_insur * 26181).toLocaleString('vi-VN')} VNĐ`],
                        ].map(([label, value], index) => (
                            <div key={index} className='py-2 flex justify-between items-center border-b-2 text-[14px] md:text-[16px] lg:text-[18px]'>
                                <label>{label}</label>
                                <span className='font-medium text-center'>{value}</span>
                            </div>
                        ))}

                        {/* QR Code */}
                        <div className='my-4 flex flex-col items-center justify-center'>
                            <p className="text-center text-[16px] font-medium mb-2">Quét mã QR để tải phiếu khám</p>
                            <img src={`data:image/png;base64,${state.QRCode}`} alt="QR Code" width={150} height={150} />
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className='flex justify-center items-center rounded-b-lg px-5 py-2'>
                        <button className='text-[14px] md:text-[16px] lg:text-[18px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorOneDark to-colorOne hover:to-emerald-700 hover:from-cyan-700 ' type='button' onClick={handleConfirmAndReturnHome}>Xác nhận và về trang chủ</button>
                        {/* <button className='ml-5 text-[17px] text-white font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600' type='button' onClick={handleGeneratePdf}>In phiếu</button> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterSuccess