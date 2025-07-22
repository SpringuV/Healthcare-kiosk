import { useNavigate } from "react-router-dom"
import { useState } from 'react'

function NonInsurrance({ onClose, onShowInputCheckInfoNon }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        address: '',
        cccd: '',
        occupation: '',
        ethnicity: '',
        phone: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/non-bhyt/info', { state: formData })
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
                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtFullName" placeholder="Nhập họ và tên của bạn" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="inputDob">Ngày/Tháng/Năm sinh:</label>
                                <input name="dob" value={formData.dob} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="date" id="inputDob" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtAddress">Địa chỉ:</label>
                                <input name="address" value={formData.address} onChange={handleChange} className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtAddress" placeholder="Nhập địa chỉ của bạn (Phường-Tỉnh)" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtCCCD">Căn cước công dân:</label>
                                <input name="cccd" value={formData.cccd} onChange={handleChange} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtCCCD" placeholder="Nhập căn cước công dân của bạn" ></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtOccupation">Nghề nghiệp:</label>
                                <input name="occupation" value={formData.occupation} onChange={handleChange} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtOccupation" placeholder="Nhập nghề nghiệp của bạn"></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtAtxtEthnicityddress">Dân tộc:</label>
                                <input name="ethnicity" value={formData.ethnicity} onChange={handleChange} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtEthnicity" placeholder="Nhập dân tộc của bạn"></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtPhoneNumber">Số điện thoại:</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="tel" id="txtPhoneNumber" max={10} min={10} placeholder="Nhập số điện thoại của bạn"></input>
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