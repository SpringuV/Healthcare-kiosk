import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal, Spin } from "antd"
import { get_service_list } from "../../services/healcare_service"
import { useDispatch, useSelector } from "react-redux"
import { select_check_patient_exist_data, select_insurance_check_data, select_patient_booking_service_loading, select_patient_register_data } from "../../reducers"
import { patient_booking_service } from "../../actions/service"
import { useGlobalContext } from "../context/provider"
import { clearToken } from "../../utils/token"
import { LoadingOutlined } from '@ant-design/icons'
import Alert from '../alert/Alert'
function ClinicRoom() {
    const [selectedClinic, setSelectedClinic] = useState(null)
    const [clinicRooms, setClinicRooms] = useState([])
    const navigate = useNavigate()
    const insurance_check_data = useSelector(select_insurance_check_data)
    const patient_exit_data = useSelector(select_check_patient_exist_data)
    const { setStateStep, flowType, selectedService, setSelectedService } = useGlobalContext()
    const patient_booking_loading = useSelector(select_patient_booking_service_loading)
    const patient_register_initial = useSelector(select_patient_register_data)
    const dispatch = useDispatch()
    const [alertText, setAlertText] = useState(null)

    useEffect(() => {
        const fetchApiService = async () => {
            try {
                const response = await get_service_list()
                const clinics = response.data.clinics || []
                // format for react-select
                const clinic_rooms = clinics.map((clinic) => ({
                    name: clinic.clinic_name,
                    services : clinic.clinic_services.map((service) => ({
                        label: service.service_name,
                        description: service.service_description,
                        price: service.price
                    }))
                }))
                setClinicRooms(clinic_rooms)
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            }
        }
        fetchApiService()
    }, [])

    useEffect(() => {
        setStateStep(2)
    }, [setStateStep])

    const handleChooseService = (service) => {
        const option = { name: service.label, clinic: selectedClinic.name, price: service.price }
        setSelectedService(option)
        setSelectedClinic(null)        
    }

    const handleRegister = async () => {
        if (!selectedService) {
            alert("Vui lòng chọn dịch vụ.")
            return
        }
        const payload = {
            service_name: selectedService.name,
            type: flowType,
        }
        const citizen_id = insurance_check_data?.citizen_id || patient_exit_data?.patient_id || patient_register_initial?.patient_id

        dispatch(patient_booking_service(citizen_id, payload))
            .then(() => {
                clearToken()
                if (flowType === "insurance") {
                    navigate("/insur/confirm-registration")
                } else {
                    navigate("/non-insur/payment")
                }
            })
            .catch((error) => {
                console.error("Registration error:", error)
                setAlertText(error.message)
            })
    }

    const handleBack = async () => {
        if (flowType === "insurance") {
            navigate("/insur/info")
        } else {
            navigate("/non-insur/info")
        }
    }

    return (
        <>
            {/* Hiện thông báo */}
            {alertText && (
                <Alert
                    textInput={alertText}
                    onClose={() => {
                        setAlertText(null) 
                        dispatch(clear_booking_service())  // reset redux state
                    }}
                    showConfirmButton={true}
                    showCancelButton={false}
                    confirmText={"Quay lại trang chủ"}
                    onConfirm={() => navigate("/")}
                />
            )}
            <div className="flex flex-col bg-white p-2 md:p-6 rounded-xl">
                <div className="text-[14px] md:text-[16px] lg:text-[18px] flex flex-col lg:flex-row w-[90vw] lg:w-[60vw] md:w-[70vw] sm:w-[80vw] gap-3 justify-center items-center">
                    
                    <div className="grid grid-cols-2 gap-[20px]">
                        {clinicRooms.map((clinic) => (
                            <button
                            key={clinic.name}
                            className="p-4 rounded-2xl shadow bg-gradient-to-r from-green-400 to-emerald-500 
                                        text-white text-left hover:scale-105 transition-all"
                            onClick={() => setSelectedClinic(clinic)}
                            >
                            <h2 className="text-lg font-bold mb-2">{clinic.name}</h2>
                            </button>
                        ))}
                    </div>
                    <Modal
                        open={!!selectedClinic}
                        onCancel={() => setSelectedClinic(null)}
                        footer={null}
                        centered
                    >
                        {selectedClinic && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-center text-green-600">
                                {selectedClinic.name}
                            </h2>
                            <div className="grid grid-cols-2 gap-[20px]">
                            {selectedClinic.services.map((service, idx) => (
                                <button
                                key={idx}
                                className="p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200"
                                onClick={() => handleChooseService(service)}
                                >
                                <div className="font-semibold">{service.label}</div>
                                </button>
                            ))}
                            </div>
                        </div>
                        )}
                    </Modal>
                </div>

                <div className="flex flex-col justify-center items-center text-[14px] md:text-[16px] lg:text-[18px]">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl">Dịch vụ đã chọn: <span className="italic text-green-600">{selectedService ? `${selectedService.clinic} - ${selectedService.name} - ${Math.round(selectedService.price * 26181).toLocaleString("vi-VN")} VNĐ` : "Xin chọn dịch vụ"}</span></p>
                    <Spin spinning={patient_booking_loading} indicator={<LoadingOutlined />}>
                        {flowType === "insurance" ? (<div className="grid grid-cols-2 gap-[20px]">
                            <button
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={handleBack}>
                                Trở lại
                            </button>
                            <button disabled={patient_booking_loading}
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={handleRegister}>
                                {patient_booking_loading == true ? (<span className="loading-dots">Đang xử lý</span>) : "Đăng kí để khám"}
                            </button>
                        </div>) : (
                            <div className="grid grid-cols-2 gap-[20px]">
                                <button
                                    className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                    onClick={handleBack}>
                                    Trở lại
                                </button>
                                <button
                                    className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                    disabled={patient_booking_loading}
                                    onClick={handleRegister}>
                                    {patient_booking_loading == true ? (<span className="loading-dots">Đang xử lý</span>) : "Bước tiếp theo: Thanh toán"}
                                </button>
                            </div>
                        )}
                    </Spin>
                </div>
            </div>
        </>
    )
}

export default ClinicRoom