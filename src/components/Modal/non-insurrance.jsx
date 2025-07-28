import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import { useForm } from "../context/form_context"
function NonInsurrance({ onClose }) {
    const { setFormData } = useForm()
    const navigate = useNavigate()
    const [localFormData, setLocalFormData] = useState({
        fullName: '',
        dob: '',
        address: '',
        gender: '',
        cccd: '',
        occupation: '',
        ethnicity: '',
        phone: '',
        service_register: []
    })

    const handleChange = (e) => {
        setLocalFormData({
            ...localFormData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setFormData(localFormData)
        navigate('/non-bhyt/info')
    }
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center h-screen flex-col">
                <div className="bg-white rounded-lg w-[80vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw] max-h-[80vh] flex flex-col">
                    <div className="p-2 bg-colorOne rounded-t-lg">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="flex-1 text-center text-white font-semibold">Nhập thông tin chi tiết</h3>
                            <i className="fa-solid fa-xmark h-5 w-5 bg-slate-300 flex justify-center items-center rounded-full hover:bg-slate-400" onClick={onClose}></i>
                        </div>
                    </div>
                    <div className="overflow-y-auto">
                        <form className="px-3" onSubmit={handleSubmit}>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtFullName">Họ và Tên:</label>
                                <input name="fullName" value={localFormData.fullName} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtFullName" placeholder="Nhập họ và tên của bạn" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="inputDob">Ngày/Tháng/Năm sinh:</label>
                                <input name="dob" value={localFormData.dob} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="date" id="inputDob" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtAddress">Địa chỉ:</label>
                                <input name="address" value={localFormData.address} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtAddress" placeholder="Nhập địa chỉ của bạn (Phường-Tỉnh)" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtCCCD">Căn cước công dân:</label>
                                <input name="cccd" value={localFormData.cccd} onChange={handleChange} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtCCCD" placeholder="Nhập căn cước công dân của bạn" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtOccupation">Nghề nghiệp:</label>
                                <select name="occupation" value={localFormData.occupation} onChange={handleChange} defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtOccupation">
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
                                <label htmlFor="txtOccupation">Giới tính:</label>
                                <select name="occupation" value={localFormData.gender} onChange={handleChange} defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtOccupation">
                                    <option value="none">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtEthnicity">Dân tộc:</label>
                                <select name="ethnicity" value={localFormData.ethnicity} onChange={handleChange} defaultValue={"none"} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" id="txtEthnicity">
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
                                <label htmlFor="txtPhoneNumber">Số điện thoại:</label>
                                <input name="phone" value={localFormData.phone} onChange={handleChange} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="tel" id="txtPhoneNumber" max={10} min={10} placeholder="Nhập số điện thoại của bạn"></input>
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

export default NonInsurrance