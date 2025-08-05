import { useState, useRef } from 'react'
import NumberPad from './number_pad'
import { useInsurrance } from "../context/insurrance_context"
import Alert from '../alert/Alert'
import NonInsurranceInfo from './non-insurrance-info'
import { useForm } from '../context/form_context'
import { useNavigate } from 'react-router-dom'

function InputCCCD({ onClose, onShowInputCheckInfo, onShowInputNonInsuranceInfo, isInsurance }) {
    const [showNumpad, setShowNumberPad] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const {setFormData} = useForm()
    const [showAlert, setShowAlert] = useState(false)
    const [alertConfig, setAlertConfig] = useState({
        text: "",
        showConfirmButton: true,
        confirmText: "Khám dịch vụ",
        cancelText: "Nhập lại thông tin",
        onConfirm: null
    })
    const navigate = useNavigate()
    const inputRef = useRef(null)

    const { setInsurranceInfo } = useInsurrance()
    
    const handleInput = (value) => {
        if (inputRef.current) {
            if (value === "delete") {
                inputRef.current.value = inputRef.current.value.slice(0, -1)
            } else {
                if (inputRef.current.value.length < 12) {
                    inputRef.current.value += value
                }
            }
        }
    }

    const showAlertWithConfig = (config) => {
        setAlertConfig({
            text: config.text || "",
            showConfirmButton: config.showConfirmButton !== false,
            confirmText: config.confirmText || "Khám dịch vụ",
            cancelText: config.cancelText || "Nhập lại thông tin",
            onConfirm: config.onConfirm || null
        })
        setShowAlert(true)
    }

    const handleCheckInfo = async (e) => {
        e.preventDefault()
        const inputValue = inputRef.current.value.trim()
        if (inputValue.length !== 12) {
            setErrorMessage("Căn cước công dân gồm 12 chữ số")
            return
        }

        try {
            // khám có bảo hiểm
            if (isInsurance) {
                const response = await fetch(`https://healthcare-kiosk.onrender.com/health-insurrances/${inputValue}`)
                // const response = await fetch(`http://127.0.0.1:8000/health-insurrances/${inputValue}`)
                if (!response.ok) {
                    showAlertWithConfig({
                        text: "Bạn không có bảo hiểm y tế, vui lòng kiểm tra lại thông tin hoặc chọn khám dịch vụ!",
                        confirmText: "Ok",
                        onConfirm: () => {
                            setShowAlert(false)
                            navigate('/')
                        }
                    })
                    return
                }
                const data = await response.json();
                // luu vao context
                setInsurranceInfo(data)
                setErrorMessage("")
                onShowInputCheckInfo()
            } else { // khám không có bảo hiểm
                // const response = await fetch(`http://127.0.0.1:8000/patient/check/${inputValue}`)
                const response = await fetch(`https://healthcare-kiosk.onrender.com/patient/check/${inputValue}`)
                if(response.ok){
                    const data = await response.json()
                    setFormData(data)
                    onShowInputNonInsuranceInfo()
                } else if (response.status === 404) {
                    showAlertWithConfig({
                        text: "Không tìm thấy thông tin bệnh nhân. Bạn có muốn đăng ký thông tin mới không?",
                        confirmText: "Đăng ký mới",
                        cancelText: "Nhập lại CCCD",
                        onConfirm: () => {
                            setShowAlert(false)
                            navigate('/non-bhyt')
                        }
                    })
                } else {
                    showAlertWithConfig({
                        text: "Có lỗi xảy ra khi kiểm tra thông tin. Vui lòng thử lại!",
                        showConfirmButton: false,
                        cancelText: "Đóng"
                    })
                }
            }

        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            showAlertWithConfig({
                text: "Lỗi kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại!",
                showConfirmButton: false,
                cancelText: "Đóng"
            })
        }
    }

    const handleKeyDownInput = (e) => {
        const allowedKeys = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"];
        const inputValue = inputRef.current.value;

        // Nếu không phải số và không nằm trong các phím cho phép → ngăn chặn
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            console.log(e.key)
            e.preventDefault();
            setErrorMessage("Không nhập kí tự chữ")
            return;
        }

        // Nếu là số và đã đủ 12 ký tự → ngăn không cho nhập thêm
        if (/[0-9]/.test(e.key) && inputValue.length >= 12) {
            setErrorMessage("Căn cước công dân gồm 12 chữ số")
            e.preventDefault();
        }
        setErrorMessage("")
    }

    return (
        <>
            {/* lớp phủ */}
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
                <div className="w-[80vw] md:w-[50vw] lg:w-[40vw] bg-white z-[100] rounded-md">
                    <div className="flex justify-between w-full items-center py-2 bg-colorOne rounded-t-md">
                        <div className="text-center flex-1 text-white font-semibold text-[18px] lg:text-[22px]">
                            <h2>Nhập thông tin</h2>
                        </div>
                        <div className="w-6 lg:w-8 flex justify-center mr-1" onClick={onClose}>
                            <i className="text-center fa-solid fa-xmark p-1 rounded-full h-6 w-6 bg-slate-300 hover:bg-slate-400"></i>
                        </div>
                    </div>
                    <div className="flex justify-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]">
                        <form className="flex flex-col w-[80%] sm:w-[70%] justify-center items-center">
                            <input maxLength={12}  onKeyDown={handleKeyDownInput} inputMode='numeric' pattern='[0-9]*' ref={inputRef} onClick={() => setShowNumberPad(true)} type="text" 
                                className="w-[80%] font-medium border-none outline-none text-white rounded-lg bg-[#006709] text-center my-3 p-2 hover:bg-colorFive focus:bg-colorFive" 
                                placeholder="Nhập thẻ căn cước công dân"
                            />
                            {errorMessage && (
                                <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
                            )}
                            {/* {showNumpad && <NumberPad onClose={() => setShowNumberPad(false)} onInput={handleInput} />} */}
                            <button className="text-white font-medium mb-4 mt-4 px-3 py-1 rounded-lg bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600" 
                                onClick={handleCheckInfo}>Kiểm tra thông tin</button>
                        </form>
                    </div>
                </div>
            </div>

            {showAlert && (
                <Alert 
                    textInput={alertConfig.text}
                    onClose={() => setShowAlert(false)}
                    onConfirm={alertConfig.onConfirm}
                    showConfirmButton={alertConfig.showConfirmButton}
                    confirmText={alertConfig.confirmText}
                    cancelText={alertConfig.cancelText}
                />
            )}
        </>
    )
}

export default InputCCCD