import { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useService } from "../../context/service_context";
import { useForm } from "../../context/form_context";
import { useInsurrance } from "../../context/insurrance_context";
import { DOMAIN } from "../../../data/port";

function ServiceItem() {
    const [options, setOptions] = useState([])
    const [selectedItemService, setSelectedItemService] = useState("Vui lòng chọn dịch vụ khám")
    const [selectedOption, setSelectedOption] = useState(null)
    const { setSelectedService } = useService()
    const navigate = useNavigate()
    const { formData } = useForm()
    const { insurranceInfo } = useInsurrance()

    const handleChange = (option) => {
        setSelectedOption(option)
        setSelectedItemService(option.label)
        setSelectedService(option.label)
    };

    useEffect(() => {
        const fetchApiService = async () => {
            try {
                const response = await fetch(`${DOMAIN}/api/services`)
                const data = await response.json()
                const services = data.services || []
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

    const handleRegister = async () => {
        const payload = {
            service_name: selectedOption.value,
        }
        const citizen_id = insurranceInfo?.citizen_id || formData?.patient_id
        if (selectedOption === "none") {
            alert("Vui lòng chọn dịch vụ.")
            return
        }
        try {
            const response = await fetch(`${DOMAIN}/orders/create/${citizen_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                alert("Đăng ký thất bại.");
                return;
            }
            const result = await response.json()
            navigate('/confirm-registration', { state: result })

        } catch (err) {
            console.error("Lỗi khi gọi API tạo order:", err);
            alert("Đã có lỗi khi đăng ký.");
        }
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
                    <a className="cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600" onClick={handleRegister}>Đăng kí để khám</a>
                </div>
            </div>
        </>
    )
}

export default ServiceItem;