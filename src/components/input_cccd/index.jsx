import { useState, useRef, useEffect } from 'react'
import NumberPad from '../number_pad'
import Alert from '../alert/Alert'
import { useNavigate } from 'react-router-dom'
import { get } from '../../utils/request'
import { Spin } from 'antd'
import { useStateStep } from '../context/state_step_context'

function InputCCCD(props) {
    const { onClose, mode, onSuccess } = props
    // const [showNumpad, setShowNumberPad] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
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

    const [spinning, setSpinning] = useState(false)
    const { setFlowType, setStateStep } = useStateStep()

    // set cho toàn trang input là step 1
    useEffect(() => {
        // set cho toàn trang input là step 1
        setStateStep(1)
        if (mode === "insurance") {
            setFlowType("insurance")
        } else if (mode === "non-insurance") {
            setFlowType("non-insurance")
        }
    }, [setStateStep, mode, setFlowType])
    // const handleInput = (value) => {
    //     if (inputRef.current) {
    //         if (value === "delete") {
    //             inputRef.current.value = inputRef.current.value.slice(0, -1)
    //         } else {
    //             if (inputRef.current.value.length < 12) {
    //                 inputRef.current.value += value
    //             }
    //         }
    //     }
    // }

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
            let response;
            setSpinning(true)
            if (mode === "insurance") {
                response = await get(`/health-insurrances/${inputValue}`)
                if (!response.ok) {
                    showAlertWithConfig({
                        text: "Bạn không có bảo hiểm y tế...",
                        confirmText: "Ok",
                        onConfirm: () => {
                            setShowAlert(false)
                            props.onClose()
                        }
                    })
                    setSpinning(false)
                    return
                }
            }
            else if (mode === "non-insurance") {
                response = await get(`/patient/check/${inputValue}`)
                if (response.status === 404) {
                    showAlertWithConfig({
                        text: "Không tìm thấy thông tin bệnh nhân...",
                        confirmText: "Đăng ký mới",
                        cancelText: "Nhập lại CCCD",
                        onConfirm: () => {
                            setShowAlert(false)
                            navigate('/non-insur/register')
                        }
                    })
                    setSpinning(false)
                    return
                }
            }
            else if (mode === "history") {
                response = await get(`/patient/history/${inputValue}`)
                if (!response.ok) {
                    showAlertWithConfig({
                        text: "Không tìm thấy lịch sử khám bệnh!",
                        showConfirmButton: false,
                        cancelText: "Đóng"
                    })
                    setSpinning(false)
                    return
                }
            }

            // nếu ok → gọi callback onSuccess để parent xử lý
            onSuccess?.(response.data)
            setSpinning(false)

        } catch (err) {
            console.error(err);
            showAlertWithConfig({
                text: "Lỗi kết nối tới máy chủ",
                showConfirmButton: false,
                cancelText: "Đóng"
            })
        }
    }

    const handleKeyDownInput = (e) => {
        const allowedKeys = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"]
        const inputValue = inputRef.current.value

        // Nếu không phải số và không nằm trong các phím cho phép → ngăn chặn
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            console.log(e.key)
            e.preventDefault()
            setErrorMessage("Không nhập kí tự chữ")
            return
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
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-0">
                <div className="w-[80vw] md:w-[50vw] lg:w-[40vw] bg-white z-[100] rounded-md">
                    <div className="flex justify-between w-full items-center py-2 bg-colorOne rounded-t-md">
                        <div className="text-center flex-1 text-white font-semibold text-[18px] lg:text-[22px]">
                            <h2>Nhập thông tin</h2>
                        </div>
                        <div className="w-6 lg:w-8 flex justify-center mr-1" onClick={onClose}>
                            <i className="text-center fa-solid fa-xmark p-1 rounded-full h-6 w-6 bg-slate-300 hover:bg-slate-400"></i>
                        </div>
                    </div>
                    <div className="flex justify-center text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px]">
                        <form className="flex flex-col w-full sm:w-[90%] md:w-[80%] justify-center items-center">
                            <input maxLength={12} onKeyDown={handleKeyDownInput} inputMode='numeric' pattern='[0-9]*' ref={inputRef} type="text"
                                // onClick={() => setShowNumberPad(true)}
                                className="w-[80%] font-medium border-none outline-none text-white rounded-lg bg-[#006709] text-center my-3 p-2 hover:bg-colorFive focus:bg-colorFive"
                                placeholder="Nhập thẻ căn cước công dân"
                            />
                            {errorMessage && (
                                <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
                            )}
                            {/* {showNumpad && <NumberPad onClose={() => setShowNumberPad(false)} onInput={handleInput} />} */}
                            <Spin spinning={spinning}>
                                <button className="text-white font-medium mb-4 mt-4 px-3 py-1 rounded-lg bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600"
                                    onClick={handleCheckInfo}>Kiểm tra thông tin</button>
                            </Spin>
                        </form>
                    </div>
                </div>
            </div>
            {/* <Outlet context={outletContext} /> */}
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