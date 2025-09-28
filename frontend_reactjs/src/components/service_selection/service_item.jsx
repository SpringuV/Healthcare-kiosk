import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal, Spin, Select } from "antd"
import { get_service_list } from "../../services/healcare_service"
import { useDispatch, useSelector } from "react-redux"
import { select_check_patient_exist_data, select_insurance_check_data, select_patient_booking_service_loading, select_patient_register_data } from "../../reducers"
import { clear_booking_service, patient_booking_service } from "../../actions/service"
import { useGlobalContext } from "../context/provider"
import { clearToken } from "../../utils/token"
import { LoadingOutlined } from '@ant-design/icons'
import Alert from '../alert/Alert'
const { Option } = Select
function ServiceItem() {
    const [options, setOptions] = useState([])
    const [selectedItemService, setSelectedItemService] = useState("Vui lòng chọn dịch vụ khám")
    const [selectedOption, setSelectedOption] = useState(null)
    const navigate = useNavigate()
    const insurance_check_data = useSelector(select_insurance_check_data)
    const patient_exit_data = useSelector(select_check_patient_exist_data)
    const { setStateStep, flowType, setSelectedService } = useGlobalContext()
    const patient_booking_loading = useSelector(select_patient_booking_service_loading)
    const patient_register_initial = useSelector(select_patient_register_data)
    const dispatch = useDispatch()
    const [alertText, setAlertText] = useState(null)

    useEffect(() => {
        const fetchApiService = async () => {
            try {
                const response = await get_service_list()
                const services = response.data.services || []
                // format for react-select
                const formattedOptions = services.map((service) => ({
                    value: service.service_name,
                    label: service.service_name,
                    description: service.service_description,
                    price: service.price,
                }))

                setOptions(formattedOptions)
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            }
        }
        fetchApiService()
    }, [])

    useEffect(() => {
        setStateStep(2)
    }, [setStateStep])

    const handleRegister = async () => {
        if (!selectedOption) {
            alert("Vui lòng chọn dịch vụ.")
            return
        }
        const payload = {
            service_name: selectedOption.value,
            type: flowType,
        }
        const citizen_id = insurance_check_data?.citizen_id || patient_exit_data?.patient_id || patient_register_initial?.patient_id
        // check
        if (!selectedOption) {
            alert("Vui lòng chọn dịch vụ.")
            return
        }
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

    const handleBack = () => {
        navigate("../info")
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
            <Modal
                footer={null}
                open={patient_booking_loading}
                closable={false}
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
                centered
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Đang xử lý, vui lòng chờ</div>
            </Modal>
            <div className="flex flex-col bg-white p-2 md:p-6 rounded-xl">
                <div className="text-[14px] md:text-[16px] lg:text-[18px] flex flex-col lg:flex-row w-[90vw] lg:w-[60vw] md:w-[70vw] sm:w-[80vw] gap-3 justify-center items-center">
                    <label className="w-[40%] font-semibold text-center" htmlFor="serviceDropdown">Lựa chọn dịch vụ khám</label>
                    <Select
                        value={selectedOption?.value}
                        onChange={(value, option) => {
                            setSelectedOption(option);      // lưu object option
                            setSelectedItemService(option.label);
                            setSelectedService(option.label);
                        }}
                        className="w-[80%]"
                        placeholder="CHỌN DỊCH VỤ KHÁM"
                        style={{ fontStyle: selectedOption ? 'italic' : 'normal' , fontWeight: selectedOption ? "bold" : "normal"}}
                    >
                        {options.map((option, index) => (
                            <Option key={index} value={option.value} label={option.label}>
                                <div className="flex justify-between">
                                    <span className="text-base">{(option.label).toUpperCase()}</span>
                                    <span className="text-base text-green-600">
                                        {(Math.round(option.price * 26181)).toLocaleString('vi-VN')} VNĐ
                                    </span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="flex flex-col justify-center items-center text-[14px] md:text-[16px] lg:text-[18px]">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl">Dịch vụ đã chọn: <span className="italic text-green-600">{(selectedItemService).toUpperCase()}</span></p>
                    <Spin spinning={patient_booking_loading} indicator={<LoadingOutlined />}>
                        {flowType === "insurance" ? (<div>
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
                            <div>
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

export default ServiceItem;