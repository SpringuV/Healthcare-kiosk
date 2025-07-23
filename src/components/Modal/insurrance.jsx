import { useState, useRef } from 'react'
import NumberPad from './number_pad'
import { insurrance } from "../../data/insurrance-api"
import {useInsurrance} from "../context/insurrance_context"

function Insurrance({ onClose, onShowInputCheckInfo }) {
    const [showNumpad, setShowNumberPad] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const inputRef = useRef(null)

    const {setInsurranceInfo} = useInsurrance()
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

    const handleCheckInfo = (e) => {
        e.preventDefault()
        const inputValue = inputRef.current.value.trim()
        if (inputValue.length !== 12) {
            setErrorMessage("Căn cước công dân gồm 12 chữ số")
            return
        }
        const resultSearch = insurrance.find(item => item.citizen_id === inputValue)
        if (!resultSearch) {
            setErrorMessage("Không tìm thấy thông tin BHYT")
            return
        } else {
            // luu vao context
            setInsurranceInfo(resultSearch)
            setErrorMessage("")
            onShowInputCheckInfo()
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
                <div className="max-h-[80vh] min-w-[30vw] max-w-[80vw] bg-white z-[100] rounded-md">
                    <div className="flex justify-between w-full items-center py-2 bg-colorOne rounded-t-md">
                        <div className="text-center flex-1 text-white font-semibold text-[23px]">
                            <h2>Nhập thông tin</h2>
                        </div>
                        <div className="w-8 flex justify-center mr-1" onClick={onClose}>
                            <i className="text-center fa-solid fa-xmark p-1 rounded-full h-6 w-6 bg-slate-300 hover:bg-slate-400"></i>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <form className="flex flex-col w-[30vw] justify-center items-center">
                            <input maxLength={12} onKeyDown={handleKeyDownInput} inputMode='numeric' pattern='[0-9]*' ref={inputRef} onClick={() => setShowNumberPad(true)} type="text" className="w-[80%] font-medium border-none outline-none text-white rounded-lg bg-[#006709] text-center my-3 p-2 hover:bg-colorFive focus:bg-colorFive" placeholder="Nhập thẻ căn cước công dân"></input>
                            {errorMessage && (
                                <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
                            )}
                            {showNumpad && <NumberPad onClose={() => setShowNumberPad(false)} onInput={handleInput} />}
                            <button className="text-white font-medium mb-4 mt-2 px-3 py-1 rounded-lg bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600" onClick={handleCheckInfo}>Kiểm tra thông tin</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Insurrance