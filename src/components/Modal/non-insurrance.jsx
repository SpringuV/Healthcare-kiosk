function NonInsurrance({ onClose }) {
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center h-screen flex-col">
                <div className="bg-white max-h-[80vh] rounded-lg max-w-[40vw]">
                    <div className="p-2 bg-colorOne rounded-t-lg">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="flex-1 text-center text-white font-semibold">Nhập thông tin chi tiết</h3>
                            <i className="fa-solid fa-xmark h-5 w-5 bg-slate-300 flex justify-center items-center rounded-full hover:bg-slate-400" onClick={onClose}></i>
                        </div>
                    </div>
                    <div className="w-[30vw] overflow-y-auto">
                        <form className="px-3">
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtFullName">Họ và Tên:</label>
                                <input className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtFullName" placeholder="Nhập họ và tên của bạn" required></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="inputDob">Ngày/Tháng/Năm sinh:</label>
                                <input className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="date" id="inputDob" required></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtAddress">Địa chỉ:</label>
                                <input className="text-colorOne outline-none px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtAddress" placeholder="Nhập địa chỉ của bạn (Phường-Tỉnh)" required></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtCCCD">Căn cước công dân:</label>
                                <input className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtCCCD" placeholder="Nhập căn cước công dân của bạn" required></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtOccupation">Nghề nghiệp:</label>
                                <input className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtOccupation" placeholder="Nhập nghề nghiệp của bạn"></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtAtxtEthnicityddress">Dân tộc:</label>
                                <input className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="text" id="txtEthnicity" placeholder="Nhập dân tộc của bạn"></input>
                            </div>
                            <div className="flex flex-col p-1">
                                <label htmlFor="txtPhoneNumber">Số điện thoại:</label>
                                <input className="outline-none text-colorOne px-2 py-1 bg-colorBody hover:bg-slate-300 focus:bg-slate-300 rounded-lg" type="tel" id="txtPhoneNumber" max={10} min={10} placeholder="Nhập số điện thoại của bạn"></input>
                            </div>
                            <div className="flex justify-center w-full my-3">
                                <button className="px-4 py-1 text-center bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600" type="submit">Lưu thông tin</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NonInsurrance