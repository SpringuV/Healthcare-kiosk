import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useInsurrance } from "../context/insurrance_context"
import Provinces from "./provinces"
import { DOMAIN } from "../../data/port"
import { useEffect } from 'react'
import { put } from "../../utils/request"
function UpdateInfoPatientInsurrance() {
    const { insurranceInfo } = useInsurrance()
    const navigate = useNavigate()
    const [updateInsurranceData, setUpdateInsurranceData] = useState({
        address: "",
        ethnicity: "",
        occupation: ""
    })

    const handleAddressSelect = (fullAddress) => {
        setUpdateInsurranceData(prev => ({
            ...prev,
            address: fullAddress
        }))
    }


    const handleChange = (e) => {
        setUpdateInsurranceData({
            ...updateInsurranceData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const citizen_id = insurranceInfo.citizen_id
        console.log(insurranceInfo.citizen_id)
        const payload = {
            address: updateInsurranceData.address,
            ethnic: updateInsurranceData.ethnicity,
            job: updateInsurranceData.occupation,
            is_insurrance: 1
        }
        try {
            const response = await put(`/patient/insurrance-info/${citizen_id}`, payload)
            if (response.ok) {
                navigate('/service')
            } else {
                alert("Lưu thông tin thất bại!")
            }
        } catch (error) {
            console.error("Lỗi gửi API:", error)
        }
    }

    const ethnicArr = ["Kinh", "Tày", "Thái", "Mường", "Khmer", "Hoa", "Nùng", "H'Mông", "Dao", "Gia Rai",
        "Ê Đê", "Ba Na", "Chăm", "Sán Dìu", "Cơ Ho", "Xơ Đăng", "Sán Chay", "Ra Glai", "Mnông",
        "Thổ", "Stiêng", "Khơ Mú", "Bru-Vân Kiều", "Cơ Tu", "Giáy", "Tà Ôi", "Mạ", "Hrê", "Chơ Ro",
        "Xinh Mun", "Hà Nhì", "Chu Ru", "Lào", "La Chí", "La Hủ", "Phù Lá", "La Ha", "Pà Thẻn",
        "Lự", "Lô Lô", "Chứt", "Mảng", "Cờ Lao", "Bố Y", "Ngái", "Si La", "Pu Péo", "Brâu",
        "Ơ Đu", "Rơ Măm", "Cống", "Cờ Tu", "Thành phần khác"]

    const { setStateStep } = useOutletContext()
    useEffect(() => {
        setStateStep(1)
    }, [])
    return (
        <>
            <div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                <div className="w-[80vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] max-h-[80vh] flex flex-col">
                    <form onSubmit={handleSubmit}                                                                                   >
                        <div className=" flex justify-between items-center bg-colorOne p-2 rounded-t-md">
                            <h1 className="flex-1 text-center text-[22px] font-semibold text-white">Cập nhật thêm thông tin</h1>
                            {/* <i className="fa-solid fa-xmark p-2 bg-slate-200 hover:bg-slate-300 h-8 w-8 flex justify-center items-center rounded-full" onClick={onClose}></i> */}
                        </div>
                        <div className="flex flex-col bg-white overflow-y-auto px-4 pt-3">
                            <div className="text-[16px]">
                                <Provinces onSelect={handleAddressSelect}></Provinces>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="txtEthnicity">Dân tộc:</label>
                                    <select value={updateInsurranceData.ethnicity} onChange={handleChange} name="ethnicity" defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtEthnicity">
                                        <option value="none">-- Chọn dân tộc --</option>
                                        {ethnicArr.map((ethnic, index) => (
                                            <option key={index} value={ethnic}>{ethnic}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="txtOccupation">Nghề nghiệp:</label>
                                    <select value={updateInsurranceData.occupation} onChange={handleChange} name="occupation" defaultValue={"none"} id="txtOccupation" className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg">
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
                            </div>
                        </div>
                        <div className="flex justify-center items-center p-3 bg-white rounded-b-md">
                            <button type="submit" className="px-3 py-1 bg-gradient-to-r from-colorTwo to-colorFive rounded-lg hover:from-green-500 hover:to-emerald-600 font-semibold text-white">Bước tiếp theo</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateInfoPatientInsurrance