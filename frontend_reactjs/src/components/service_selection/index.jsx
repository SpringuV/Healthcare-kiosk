import { useState, useEffect } from "react"
import ServiceItem from "./service_item"
import ClinicRoom from "../clinic_room"
import { useGlobalContext } from "../context/provider"
import { Helmet } from "react-helmet-async"
import { useSelector } from "react-redux"
import { select_check_patient_exist_data, select_insurance_check_data, select_patient_register_data } from "../../reducers"

function Service() {
    const [setSelectedService] = useState(null)

    // Thông tin người dùng
    const insurance_check_data = useSelector(select_insurance_check_data)
    const patient_exit_data = useSelector(select_check_patient_exist_data)
    const patient_register_initial = useSelector(select_patient_register_data)
    const fullname = insurance_check_data?.full_name || patient_exit_data?.full_name || patient_register_initial?.full_name
    const gender = insurance_check_data?.gender || patient_exit_data?.gender || patient_register_initial?.gender

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
                <div className='overflow-y-hidden p-3 w-full'>
                    <div className="flex justify-center items-center flex-wrap gap-1 md:gap-2 lg:gap-4 font-bold text-[20px]">Bệnh nhân: {fullname} - {gender}</div>
                    <div className="flex justify-center items-center mt-3">
                        <ClinicRoom onClose={() => setSelectedService(null)}></ClinicRoom>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Service