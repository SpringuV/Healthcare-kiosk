import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useInsurrance } from "../context/insurrance_context"
function UpdateInfoPatientInsurrance() {
    const {insurranceInfo} = useInsurrance()
    const navigate = useNavigate()
    const [updateInsurranceData, setUpdateInsurranceData] = useState({
        address: "",
        ethnicity: "",
        occupation: ""
    })

    const handleChange = (e) => {
        setUpdateInsurranceData({
            ...updateInsurranceData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const citizen_id = insurranceInfo.citizen_id
        const payload = {
            address: updateInsurranceData.address,
            ethnic: updateInsurranceData.ethnicity,
            job: updateInsurranceData.occupation,
            is_insurrance: 1
        }
        try {
            const response = await fetch(`http://localhost:8000/patient/insurrance-info/${citizen_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                navigate('/service')
            } else {
                alert("Lưu thông tin thất bại!")
            }
        } catch (error) {
            console.error("Lỗi gửi API:", error)
        }
    }
    return (
        <>
            <div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                <div className="min-w-[30vw]">
                    <form onSubmit={handleSubmit}                                                                                   >
                        <div className=" flex justify-between items-center bg-colorOne p-2 rounded-t-md">
                            <h1 className="flex-1 text-center text-[22px] font-semibold text-white">Cập nhật thêm thông tin</h1>
                            {/* <i className="fa-solid fa-xmark p-2 bg-slate-200 hover:bg-slate-300 h-8 w-8 flex justify-center items-center rounded-full" onClick={onClose}></i> */}
                        </div>
                        <div className="flex flex-col bg-white overflow-y-auto px-4 min-w-[30vw] pt-3">
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtAddress">Địa chỉ:</label>
                                <input value={updateInsurranceData.address} onChange={handleChange} name="address" className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtAddress" placeholder="Nhập địa chỉ của bạn" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtEthnicity">Dân tộc:</label>
                                <select value={updateInsurranceData.ethnicity} onChange={handleChange} name="ethnicity" defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtEthnicity">
                                    <option value="none">-- Chọn dân tộc --</option>
                                    <option value="Kinh">Kinh</option>
                                    <option value="Tày">Tày</option>
                                    <option value="Thái">Thái</option>
                                    <option value="Mường">Mường</option>
                                    <option value="Khmer">Khmer</option>
                                    <option value="Hoa">Hoa</option>
                                    <option value="Nùng">Nùng</option>
                                    <option value="Hmong">H'Mông</option>
                                    <option value="Dao">Dao</option>
                                    <option value="Gia Rai">Gia Rai</option>
                                    <option value="Ê Đê">Ê Đê</option>
                                    <option value="Ba Na">Ba Na</option>
                                    <option value="Chăm">Chăm</option>
                                    <option value="Sán Đùng">Sán Dìu</option>
                                    <option value="Cơ Ho">Cơ Ho</option>
                                    <option value="Xơ Đăng">Xơ Đăng</option>
                                    <option value="Sán Chay">Sán Chay</option>
                                    <option value="Ra Glai">Ra Glai</option>
                                    <option value="Mnông">Mnông</option>
                                    <option value="Thổ">Thổ</option>
                                    <option value="Stiêng">Stiêng</option>
                                    <option value="Khơ Mú">Khơ Mú</option>
                                    <option value="Bru-Vân Kiều">Bru-Vân Kiều</option>
                                    <option value="Cơ Tu">Cơ Tu</option>
                                    <option value="Giáy">Giáy</option>
                                    <option value="Tà Ôi">Tà Ôi</option>
                                    <option value="Mạ">Mạ</option>
                                    <option value="Hre">Hrê</option>
                                    <option value="Chơ Ro">Chơ Ro</option>
                                    <option value="Xinh Mun">Xinh Mun</option>
                                    <option value="Hà Nhì">Hà Nhì</option>
                                    <option value="Chu Ru">Chu Ru</option>
                                    <option value="Lào">Lào</option>
                                    <option value="La Chí">La Chí</option>
                                    <option value="La Hủ">La Hủ</option>
                                    <option value="Phù Lá">Phù Lá</option>
                                    <option value="La Ha">La Ha</option>
                                    <option value="Pà Thẻn">Pà Thẻn</option>
                                    <option value="Lự">Lự</option>
                                    <option value="Lô Lô">Lô Lô</option>
                                    <option value="Chứt">Chứt</option>
                                    <option value="Mảng">Mảng</option>
                                    <option value="Cờ Lao">Cờ Lao</option>
                                    <option value="Bố Y">Bố Y</option>
                                    <option value="Ngái">Ngái</option>
                                    <option value="Si La">Si La</option>
                                    <option value="Pu Péo">Pu Péo</option>
                                    <option value="Brâu">Brâu</option>
                                    <option value="Ơ Đu">Ơ Đu</option>
                                    <option value="Rơ Măm">Rơ Măm</option>
                                    <option value="Cống">Cống</option>
                                    <option value="Cờ Tu">Cờ Tu</option>
                                    <option value="Thành phần khác">Thành phần khác</option>
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