import { useState, useEffect } from "react"
import ServiceItem from "./service_item"
import { useGlobalContext } from "../context/provider"
import { Helmet } from "react-helmet-async"
function Service() {
    const [selectedService, setSelectedService] = useState(null)
    const service = ['Lấy số', 'Đăng kí khám', 'Tra cứu']

    const context = useGlobalContext()
    const { setStateStep } = context
    useEffect(() => {
        setStateStep(2)
    }, [setStateStep])

    useEffect(() => {
        const audio = new Audio("/audio/choose_service.mp3")
        audio.play().catch(err => {
            console.warn("Trình duyệt chặn autoplay, cần user interaction:", err)
        })
    }, [])
    return (
        <>
            <Helmet>
                <title>Chọn dịch vụ</title>
            </Helmet>
            <div className='h-screen flex flex-col items-center'>
                <div className='overflow-y-auto p-3 w-full'>
                    <div className='flex justify-center items-center flex-wrap gap-1 md:gap-2 lg:gap-4 '>
                        {service.map((text, i) => (
                            <div key={i} className='rounded-xl' onClick={() => setSelectedService(text)}>
                                <div className={`cursor-pointer flex justify-center items-center p-3 rounded-xl bg-gradient-to-r w-full ${selectedService === text ? " from-green-600 to-emerald-600 " : " from-teal-800 to-teal-600 "}`}>
                                    <h3 className='text-white font-bold text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]'>{text}</h3>
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