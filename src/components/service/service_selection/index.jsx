import { useState } from "react";

function ServiceItem() {
    const [selectedItemService, setSelectedItemService] = useState("Vui lòng chọn dịch vụ khám")
    return (
        <>
            <div className="flex flex-col">
                <div className="flex gap-3 justify-center items-center bg-white p-6 rounded-xl">
                    <label className="w-[50%]" htmlFor="serviceDropdown">Lựa chọn dịch vụ khám</label>
                    <select value={selectedItemService} onChange={(e) => setSelectedItemService(e.target.value)} className="appearance-none px-3 py-2 focus:outline-none bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl" id="serviceDropdown">
                        <option className="text-black text-center" value="Vui lòng chọn dịch vụ khám">Chọn dịch vụ khám</option>
                        <optgroup className="text-black " label="Khám chuyên khoa">
                            <div className="text-center">
                                <option value="Khám nội tổng quát">Khám nội tổng quát</option>
                                <option value="Khám chuyên khoa Thận">Khám chuyên khoa Thận</option>
                                <option value="Khám chuyên khoa Đái tháo đường">Khám chuyên khoa Đái tháo đường</option>
                                <option value="Khám chuyên khoa Nội tiết">Khám chuyên khoa Nội tiết</option>
                                <option value="Khám chuyên khoa Tiêu hóa">Khám chuyên khoa Tiêu hóa</option>
                                <option value="Khám chuyên khoa Hô hấp">Khám chuyên khoa Hô hấp</option>
                            </div>
                        </optgroup>

                        <optgroup className="text-black" label="Xét nghiệm">      
                            <div className="text-center">
                                <option value="Xét nghiệm máu tổng quát">Xét nghiệm máu tổng quát</option>
                                <option value="Chức năng thận (Ure, Creatinin)">Chức năng thận (Ure, Creatinin)</option>
                                <option value="Xét nghiệm nước tiểu">Xét nghiệm nước tiểu</option>
                                <option value="Xét nghiệm đường huyết">Xét nghiệm đường huyết</option>
                                <option value="Xét nghiệm HbA1c (đái tháo đường)">Xét nghiệm HbA1c (đái tháo đường)</option>
                                <option value="Xét nghiệm mỡ máu (Cholesterol, Triglyceride)">Xét nghiệm mỡ máu (Cholesterol, Triglyceride)</option>
                            </div>
                        </optgroup>

                        <optgroup className="text-black" label="Chẩn đoán hình ảnh">
                            <div className="text-center">
                                <option value="Siêu âm thận">Siêu âm thận</option>
                                <option value="X-quang hệ tiết niệu">X-quang hệ tiết niệu</option>
                            </div>
                        </optgroup>
                    </select>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl">Dịch vụ đã chọn: <span className="italic text-green-600">{selectedItemService}</span></p>
                    <a className="cursor-pointer px-3 py-1 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600">Đăng kí và in phiếu</a>
                </div>
            </div>
        </>
    )
}

export default ServiceItem;