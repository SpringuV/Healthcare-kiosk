import { useNavigate } from "react-router-dom"

function Alert({ textInput, onClose, onConfirm, showConfirmButton = true, showCancelButton = true, confirmText = "Khám dịch vụ", cancelText = "Nhập lại thông tin" }) {
    const navigate = useNavigate()

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm() // Gọi callback từ parent
        } else {
            navigate('/non-bhyt') // Default behavior
        }
    }

    return (
        <>
            <div className="fixed flex inset-0 justify-center items-center flex-col backdrop-blur-sm z-[200]">
                <div className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                    <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 text-center rounded-t-xl font-semibold text-white uppercase">
                        <h3>Thông báo</h3>
                    </div>
                    <div className="bg-white p-5 w-full text-center">
                        <span>{textInput}</span>
                    </div>
                    <div className="p-3 flex justify-end bg-gradient-to-r from-emerald-500 to-teal-700 rounded-b-xl">
                        {showCancelButton && (
                            <button type="button" className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-400 hover:bg-gray-500 mr-4" onClick={onClose}>
                                {cancelText}
                            </button>
                        )}
                        {showConfirmButton && (
                            <button
                                type="button"
                                className="lg:px-4 lg:py-2 px-2 py-1 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                onClick={handleConfirm}
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Alert