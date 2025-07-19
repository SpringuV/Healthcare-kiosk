function ServiceItem({onClose}) {
    return (
        <>
            <div>
                <select id="serviceDropdown">
                    <optgroup label="Khám chuyên khoa">
                        <option value="general">Khám nội tổng quát</option>
                        <option value="nephro">Khám chuyên khoa Thận</option>
                        <option value="diabetes">Khám chuyên khoa Đái tháo đường</option>
                        <option value="hormonal">Khám chuyên khoa Nội tiết</option>
                        <option value="digest">Khám chuyên khoa Tiêu hóa</option>
                        <option value="respiratory">Khám chuyên khoa Hô hấp</option>
                    </optgroup>

                    <optgroup label="Xét nghiệm">
                        <option value="blood_test">Xét nghiệm máu tổng quát</option>
                        <option value="creatinine">Chức năng thận (Ure, Creatinin)</option>
                        <option value="urine">Xét nghiệm nước tiểu</option>
                        <option value="blood_sugar">Xét nghiệm đường huyết</option>
                        <option value="HbA1c">Xét nghiệm HbA1c (đái tháo đường)</option>
                        <option value="blood_fat">Xét nghiệm mỡ máu (Cholesterol, Triglyceride)</option>
                    </optgroup>

                    <optgroup label="Chẩn đoán hình ảnh">
                        <option value="ultrasound">Siêu âm thận</option>
                        <option value="xray">X-quang hệ tiết niệu</option>
                    </optgroup>
                </select>
            </div>
        </>
    )
}

export default ServiceItem;