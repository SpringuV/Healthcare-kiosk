import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import { useForm } from "../context/form_context"
import Provinces from "../provinces"
import { useEffect } from 'react'
import { post } from "../../utils/request"
import { useStateStep } from "../context/state_step_context"
function Register({ onClose }) {
    const { setFormData } = useForm()
    const navigate = useNavigate()
    const [localFormData, setLocalFormData] = useState({
        full_name: '',
        dob: '',
        address: '',
        gender: '',
        patient_id: '',
        job: '',
        ethnic: '',
        phone_number: ''
    })
    const { setStateStep, flowType } = useStateStep();
    useEffect(() => {
        setStateStep(1);
    }, [setStateStep]);

    const handleChange = (e) => {
        setLocalFormData({
            ...localFormData,
            [e.target.name]: e.target.value
        })
    }
    const onlyGetNum = (e) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '')
        setLocalFormData(prev => ({
            ...prev,
            [e.target.name]: onlyNums
        }));
    }

    const handleAddressSelect = (fullAddress) => {
        setLocalFormData(prev => ({
            ...prev,
            address: fullAddress
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!localFormData.patient_id || !localFormData.full_name || !localFormData.dob) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }
        if (localFormData.phone_number.length > 10 || localFormData.phone_number.length < 10) {
            alert("Vui lòng điền đúng số điện thoại 10 số")
            return
        }

        if (localFormData.patient_id.length > 12 || localFormData.patient_id.length < 12) {
            alert("Vui lòng điền đúng số căng cước công dân 12 số")
            return
        }

        if (localFormData.ethnic === "none") {
            alert("Bạn vui lòng chọn dân tộc")
            return
        }
        if (localFormData.job === "none") {
            alert("Bạn vui lòng chọn nghề nghiệp")
            return
        }

        if (localFormData.gender === "none" || localFormData.gender === "") {
            alert("Bạn vui lòng chọn giới tính")
            return
        }

        let gender = false
        if (localFormData.gender === "Nam") { gender = true }
        const payload = {
            patient_id: localFormData.patient_id,
            full_name: localFormData.full_name,
            gender: gender, // true nếu Nam
            dob: localFormData.dob,
            address: localFormData.address,
            phone_number: localFormData.phone_number,
            ethnic: localFormData.ethnic,
            job: localFormData.job,
            is_insur: flowType === 'insurance'
        }
        try {
            const response = await post(`/patient/register`, payload)
            console.log(flowType, flowType === 'insurance')
                if (response.ok) {
                    if (flowType === 'insurance') {
                        navigate('/insur/service')
                    }
                    else {
                        navigate('/non-insur/info')
                    }
                } else {
                    alert(`Lưu thông tin thất bại`)
                }
            } catch (error) {
                console.error("Lỗi gửi API:", error)
            }
            setFormData(localFormData)
        }

    const ethnicArr = ["Kinh", "Tày", "Thái", "Mường", "Khmer", "Hoa", "Nùng", "H'Mông", "Dao", "Gia Rai",
        "Ê Đê", "Ba Na", "Chăm", "Sán Dìu", "Cơ Ho", "Xơ Đăng", "Sán Chay", "Ra Glai", "Mnông",
        "Thổ", "Stiêng", "Khơ Mú", "Bru-Vân Kiều", "Cơ Tu", "Giáy", "Tà Ôi", "Mạ", "Hrê", "Chơ Ro",
        "Xinh Mun", "Hà Nhì", "Chu Ru", "Lào", "La Chí", "La Hủ", "Phù Lá", "La Ha", "Pà Thẻn",
        "Lự", "Lô Lô", "Chứt", "Mảng", "Cờ Lao", "Bố Y", "Ngái", "Si La", "Pu Péo", "Brâu",
        "Ơ Đu", "Rơ Măm", "Cống", "Cờ Tu", "Thành phần khác"]

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center h-screen flex-col">
                <div className="bg-white rounded-lg w-[80vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] max-h-[80vh] flex flex-col text-[17px]">
                    <div className="p-2 bg-colorOne rounded-t-lg">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="flex-1 text-center text-white font-semibold">Nhập thông tin chi tiết</h3>
                            <i className="fa-solid fa-xmark h-5 w-5 bg-slate-300 flex justify-center items-center rounded-full hover:bg-slate-400" onClick={onClose}></i>
                        </div>
                    </div>
                    <div className="overflow-y-auto">
                        <form className="px-3" onSubmit={handleSubmit}>
                            <div className="text-[16px]">
                                <div className="flex flex-col p-1 ">
                                    <label htmlFor="txtFullName">Họ và Tên:</label>
                                    <input name="full_name" value={localFormData.full_name} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtFullName" placeholder="Nhập họ và tên của bạn" ></input>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="inputDob">Ngày/Tháng/Năm sinh:</label>
                                    <input name="dob" value={localFormData.dob} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="date" id="inputDob" ></input>
                                </div>
                                {/* Địa chỉ */}
                                <Provinces onSelect={handleAddressSelect}></Provinces>
                                <div className="px-3 py-1 text-sm text-gray-700">
                                    <p className="text-center font-medium"><strong>Địa chỉ:</strong> {localFormData.address || "Chưa chọn"}</p>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="txtCCCD">Căn cước công dân:</label>
                                    <input inputMode="numeric" pattern="[0-9]{12}" name="patient_id" value={localFormData.patient_id} onChange={onlyGetNum} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" maxLength={12} type="text" id="txtCCCD" placeholder="Nhập căn cước công dân của bạn" ></input>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="txtOccupation">Nghề nghiệp:</label>
                                    <select name="job" value={localFormData.job} onChange={handleChange} defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtOccupation">
                                        <option value="none">-- Chọn nghề nghiệp --</option>
                                        <option value="Sinh viên">Sinh viên</option>
                                        <option value="Công nhân">Công nhân</option>
                                        <option value="Nhân viên văn phòng">Nhân viên văn phòng</option>
                                        <option value="Giáo viên">Giáo viên</option>
                                        <option value="Kĩ sư">Kĩ sư</option>
                                        <option value="Bác sĩ">Bác sĩ</option>
                                        <option value="Nông dân">Nông dân</option>
                                        <option value="Kinh doanh">Kinh doanh</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="txtGender">Giới tính:</label>
                                    <select name="gender" value={localFormData.gender} onChange={handleChange} defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtGender">
                                        <option value="none">-- Chọn giới tính --</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="txtEthnicity">Dân tộc:</label>
                                    <select name="ethnic" value={localFormData.ethnic} onChange={handleChange} defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtEthnicity">
                                        <option value="none">-- Chọn dân tộc --</option>
                                        {ethnicArr.map((ethnic, index) => (
                                            <option key={index} value={ethnic}>{ethnic}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="txtPhoneNumber">Số điện thoại:</label>
                                    <input name="phone_number" value={localFormData.phone_number} onChange={onlyGetNum} maxLength={10} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtPhoneNumber" max={10} min={10} placeholder="Nhập số điện thoại của bạn"></input>
                                </div>
                            </div>
                            <div className="flex justify-center w-full my-3">
                                <button className="cursor-pointer px-4 py-1 text-center bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600" type="submit">Bước tiếp theo</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register