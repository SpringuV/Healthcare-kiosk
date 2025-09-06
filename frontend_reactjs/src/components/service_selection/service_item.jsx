import { useEffect, useState } from "react"
import Select from "react-select"
import { useNavigate } from "react-router-dom"
import { Spin } from "antd"
import { get_service_list } from "../../services/healcare_service"
import { useDispatch, useSelector } from "react-redux"
import { select_check_patient_exist_data, select_insurance_check_data, select_patient_booking_service_loading } from "../../reducers"
import { patient_booking_service } from "../../actions/service"
import { useGlobalContext } from "../context/provider"

function ServiceItem() {
    const [options, setOptions] = useState([])
    const [selectedItemService, setSelectedItemService] = useState("Vui lòng chọn dịch vụ khám")
    const [selectedOption, setSelectedOption] = useState(null)
    const navigate = useNavigate()
    const insurance_check_data = useSelector(select_insurance_check_data)
    const patient_exit_data = useSelector(select_check_patient_exist_data)
    const { setStateStep, flowType, setSelectedService } = useGlobalContext()
    const patient_booking_loading = useSelector(select_patient_booking_service_loading)
    const dispatch = useDispatch()

    const handleChange = (option) => {
        setSelectedOption(option)
        setSelectedItemService(option.label)
        setSelectedService(option.label)
    };

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
        const citizen_id = insurance_check_data?.citizen_id || patient_exit_data?.patient_id
        // check
        if (!selectedOption) {
            alert("Vui lòng chọn dịch vụ.")
            return
        }
        dispatch(await patient_booking_service(citizen_id, payload))
        .then(() => {
            if (flowType === "insurance") {
                navigate("/insur/confirm-registration")
            } else {
                navigate("/non-insur/payment")
            }
        })
        .catch((error) => {
            console.error("Registration error:", error)
        })
    }

    return (
        <>
            <div className="flex flex-col bg-white p-2 md:p-6 rounded-xl">
                <div className="text-[14px] md:text-[16px] lg:text-[18px] flex flex-col lg:flex-row w-[90vw] lg:w-[60vw] md:w-[70vw] sm:w-[80vw] gap-3 justify-center items-center">
                    <label className="w-[40%] font-semibold text-center" htmlFor="serviceDropdown">Lựa chọn dịch vụ khám</label>
                    <Select
                        options={options}
                        value={selectedOption}
                        onChange={handleChange}
                        placeholder="Chọn dịch vụ khám"
                        isSearchable={false}
                        className="text-left text-white flex-1"
                        formatOptionLabel={(option, { isFocused, isSelected }) => (
                            <div
                                title={option.description}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: '4px 8px',
                                    gap: '20px',
                                    color: isFocused || isSelected ? "white" : "black",
                                }}
                            >
                                <span>{option.label}</span>
                                <span style={{
                                    color: isFocused || isSelected ? "white" : "black",
                                    fontWeight: 'bold'
                                }}>
                                    {(Math.round(option.price * 26181)).toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                        )}
                        styles={{
                            placeholder: (base) => ({
                                ...base,
                                color: "white",
                                fontWeight: "bold",
                            }),
                            control: (base) => ({
                                ...base,
                                background: "linear-gradient(to right, #0d9488, #059669)",
                                color: "white",
                                borderRadius: "12px",
                                borderColor: "transparent",
                                padding: "4px",
                            }),
                            menu: (base) => ({
                                ...base,
                                width: 'auto',
                                minWidth: '300px',
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "white", // chữ dịch vụ đã chọn màu trắng
                                fontWeight: "bold",
                            }),
                            option: (base, { isFocused, isSelected }) => ({
                                ...base,
                                backgroundColor: isSelected
                                    ? "#10b981" // màu nền khi được chọn
                                    : isFocused
                                        ? "#10b981" // màu nền khi hover
                                        : "white",
                                color: isSelected || isFocused ? "white" : "black", // chữ trắng khi hover hoặc chọn
                                fontWeight: isSelected ? "bold" : "normal",
                                cursor: "pointer",
                            }),
                        }}
                    />
                </div>
                <div className="flex flex-col justify-center items-center text-[14px] md:text-[16px] lg:text-[18px]">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl">Dịch vụ đã chọn: <span className="italic text-green-600">{selectedItemService}</span></p>
                    <Spin spinning={patient_booking_loading}>
                        {flowType === "insurance" ? (<div>
                            <button disabled={patient_booking_loading} className="cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50" onClick={handleRegister} >Đăng kí để khám</button>
                        </div>) : (
                            <button className="cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50" disabled={patient_booking_loading} onClick={handleRegister}>Bước tiếp theo: Thanh toán</button>
                        )}

                    </Spin>
                </div>
            </div>
        </>
    )
}

export default ServiceItem;