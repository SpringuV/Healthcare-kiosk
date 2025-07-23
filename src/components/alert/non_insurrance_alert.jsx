import { useNavigate } from "react-router-dom"

function AlertNonInsurrance({onClose}) {
    const navigate = useNavigate()
    return (
        <>
            <div className="fixed flex inset-0 justify-center items-center flex-col backdrop-blur-sm">
                <div className="w-fit">
                    <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 text-center rounded-t-xl font-semibold text-[20px] text-white uppercase">
                        <h3>Thông báo</h3>
                    </div>
                    <div className="bg-white p-5 text-[20px] w-[30vw] text-center">
                        <span>Bạn không có bảo hiểm y tế, chuyển sang khám dịch vụ, hoặc nhập lại !</span>
                    </div>
                    <div className="p-3 flex justify-end bg-gradient-to-r from-emerald-500 to-teal-700 rounded-b-xl">
                        <button type="button" className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-400 hover:bg-gray-500 mr-4" onClick={onClose}>Nhập lại thông tin</button>
                        <button type="button" className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" onClick={()=> navigate('/non-bhyt')}>Khám dịch vụ</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AlertNonInsurrance