function Insurrance({ onClose }) {

    const [showInfo, setShowInfo] = useState(false)
    return (
        <>
            {/* lớp phủ */}
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
                <div className="max-h-[80vh] max-w-[40vw] bg-white z-[100] rounded-md">
                    <div className="flex justify-between w-full items-center py-1 bg-colorOne rounded-t-md">
                        <div className="text-center flex-1 text-white font-semibold">
                            <h2>Nhập thông tin</h2>
                        </div>
                        <div className="w-8 flex justify-center" onClick={onClose}>
                            <i className="text-center fa-solid fa-xmark p-1 rounded-full h-6 w-6 bg-slate-300 hover:bg-slate-400"></i>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <form className="flex flex-col w-[30vw] justify-center items-center">
                            <input type="text" className="w-[80%] font-medium border-none outline-none text-white rounded-lg bg-[#006709] text-center my-3 p-2 hover:bg-colorFive focus:bg-colorFive" placeholder="Nhập thẻ căn cước công dân"></input>
                            <button className="text-white font-medium mb-4 mt-2 px-3 py-1 rounded-lg bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600" onClick={() => setShowInfo(true)}>Kiểm tra thông tin</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* lấy từ api các cái show info */}
            {showInfo && (
                <div>
                    <div className="flex justify-between items-center bg-colorOne text-white p-2 rounded-t-md">
                        <h1>Thông tin bảo hiểm y tế</h1>
                        <i className="fa-solid fa-xmark p-2 bg-slate-200 hover:bg-slate-300"></i>
                    </div>
                    <div>
                        <div>
                            <label className="font-semibold">Họ và tên:</label>
                            <span>Nguyễn Văn A</span>
                        </div>
                        <div>
                            <label className="font-semibold">Ngày sinh:</label>
                            <span>01/01/1990</span>
                        </div>
                        <div>
                            <label className="font-semibold">Số thẻ bảo hiểm y tế:</label>
                            <span>1234567890</span>
                        </div>
                        <div>
                            <label className="font-semibold">Thời hạn sử dụng:</label>
                            <span>01/01/2023 - 31/12/2023</span>
                        </div>
                        <div>
                            <label className="font-semibold">Nơi Cấp:</label>
                            <span>Bệnh viện A</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Insurrance