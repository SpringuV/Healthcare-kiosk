import { useState } from "react";
import { groupedOptions } from "./option";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useService } from "../../context/service_context";

function ServiceItem() {
    const [selectedItemService, setSelectedItemService] = useState("Vui lòng chọn dịch vụ khám")
    const [selectedOption, setSelectedOption] = useState(null)
    const {setSelectedService } = useService()

    const handleChange = (option) => {
        setSelectedOption(option)
        setSelectedItemService(option.label)
        setSelectedService(option.label)
    };

    const navigate = useNavigate()

    return (
        <>
            <div className="flex flex-col">
                <div className="flex w-[40vw] gap-3 justify-center items-center bg-white p-6 rounded-xl">
                    <label className="w-[40%]" htmlFor="serviceDropdown">Lựa chọn dịch vụ khám</label>
                    <Select
                        options={groupedOptions}
                        value={selectedOption}
                        onChange={handleChange}
                        placeholder="Chọn dịch vụ khám"
                        isSearchable
                        className="text-left text-white flex-1"

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
                            singleValue: (base) => ({
                                ...base,
                                color: "white",
                                fontWeight: "bold",
                            }),
                            option: (base, { isFocused }) => ({
                                ...base,
                                backgroundColor: isFocused ? "#10b981" : "white",
                                color: isFocused ? "white" : "black",
                            }),
                        }}
                    />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl">Dịch vụ đã chọn: <span className="italic text-green-600">{selectedItemService}</span></p>
                    <a className="cursor-pointer px-3 py-1 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600" onClick={() => navigate('/confirm-registration')}>Đăng kí để khám</a>
                </div>
            </div>
        </>
    )
}

export default ServiceItem;