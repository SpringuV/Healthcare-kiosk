import { useState } from "react"
import Header from "../Header"
function Service() {
    const [selectedService, setSelectedService] = useState(null)
    const service = ['Lấy số', 'Liên thông hồ sơ bệnh án (CCCD/VNEID)', 'Đăng kí khám', 'Tra cứu', 'Đăng kí mở bảo hiểm', 'Bản đồ', 'Ngân hàng số 24/7']
    return (
        <>
            <div className='h-screen flex flex-col'>
                <Header></Header>
                <div className='py-2 w-full flex justify-center'>
                    <h2 className='text-center text-colorOne font-extrabold text-[22px] w-[80vw]'>Chào mừng bạn tới KIOSK phục vụ tự động, vui lòng
                        chọn dịch vụ bạn muốn thực hiện!</h2>
                </div>
                <div className='flex-1 overflow-y-auto p-3'>
                    <div className='grid grid-cols-2 w-full gap-3'>
                        {service.map((text, i) => (
                            <div key={i} className='flex justify-center' onClick={() => setSelectedService(text)}>
                                <div className='flex justify-center items-center p-3 rounded-xl bg-white w-[85%]'>
                                    <i className='fa-solid fa-ticket-simple mr-2 text-colorOne text-[12px]'></i>
                                    <h3 className='text-colorOne font-extrabold text-[17px]'>{text}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Service