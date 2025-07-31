import { useState } from "react"
import ServiceItem from "./service_selection"
function Service() {
    const [selectedService, setSelectedService] = useState(null)
    const service = ['Lấy số', 'Đăng kí khám', 'Tra cứu']

    return (
        <>
            <div className='h-screen flex flex-col'>
                {/* <div className='py-2 w-full flex justify-center'>
                    <h2 className='text-center text-colorOne font-extrabold text-[22px] w-[80vw]'>Chào mừng bạn tới KIOSK phục vụ tự động, vui lòng
                        chọn dịch vụ bạn muốn thực hiện!</h2>
                </div> */}
                <div className='overflow-y-auto p-3'>
                    <div className='flex justify-center items-center flex-wrap gap-3'>
                        {service.map((text, i) => (
                            <div key={i} className='bg-white px-5 py-3 rounded-xl' onClick={() => setSelectedService(text)}>
                                <div className='cursor-pointer flex justify-center items-center p-3 rounded-xl bg-gradient-to-r from-teal-800 to-teal-600 w-fit'>
                                    <h3 className='text-white font-bold text-[17px]'>{text}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {selectedService === "Đăng kí khám" && (
                    <div className="flex justify-center items-center mt-3">
                        <ServiceItem onClose={() => setSelectedService(null)}></ServiceItem>
                    </div>
                )}
            </div>

        </>
    )
}
export default Service