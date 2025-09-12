/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, Spin } from 'antd'
import Alert from '../alert/Alert'
import { check_insurance_user, check_patient_existed, clear_insurance_check, history_booking_service } from '../../actions/patient'
import {
    select_insurance_loading,
    select_insurance_error,
    select_check_patient_exist_loading,
    select_check_patient_exist_error,
    select_history_booking_loading,
    select_history_booking_error
} from '../../reducers'
import { useGlobalContext } from '../context/provider'
import { Helmet } from 'react-helmet-async'
import { LoadingOutlined } from '@ant-design/icons'

function InputCCCD(props) {
    const { onClose, mode, onSuccess } = props

    // Redux hooks
    const dispatch = useDispatch()
    // insurance
    const insurance_loading = useSelector(select_insurance_loading)
    const insurance_error = useSelector(select_insurance_error)
    // check patient exist 
    const check_patient_exist_loading = useSelector(select_check_patient_exist_loading)
    const check_patient_exist_error = useSelector(select_check_patient_exist_error)

    // history booking
    const history_booking_loading = useSelector(select_history_booking_loading)
    const history_booking_error = useSelector(select_history_booking_error)

    // Local state
    const [error_message, set_error_message] = useState("")
    const [show_alert, set_show_alert] = useState(false)
    const [alert_config, set_alert_config] = useState({
        text: "",
        showConfirmButton: true,
        confirmText: "Khám dịch vụ",
        cancelText: "Nhập lại thông tin",
        onConfirm: null
    })
    const [delayLoading, setDelayLoading] = useState(false)
    // Hooks
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const { setFlowType, setStateStep } = useGlobalContext()
    // const timeDelay = 2000
    // Setup initial state
    useEffect(() => {
        setStateStep(1)
        if (mode === "insurance") {
            setFlowType("insurance")
            // Clear previous insurance check data
            dispatch(clear_insurance_check())
        } else if (mode === "non-insurance") {
            setFlowType("non-insurance")
        }
    }, [setStateStep, mode, setFlowType, dispatch])

    //  Auto play audio khi trang render
    useEffect(() => {
        const audio = new Audio("/audio/input_cccd.mp3")
        audio.play().catch(err => {
            console.warn("Trình duyệt chặn autoplay, cần user interaction:", err)
        })
    }, [])

    const show_alert_with_config = (config) => {
        set_alert_config({
            text: config.text || "",
            showConfirmButton: config.showConfirmButton !== false,
            confirmText: config.confirmText || "Khám dịch vụ",
            cancelText: config.cancelText || "Nhập lại thông tin",
            onConfirm: config.onConfirm || null
        })
        set_show_alert(true)
    }

    const handle_insurance_mode = async (input_value) => {
        try {
            setDelayLoading(true)
            const result = await dispatch(check_insurance_user(input_value))
            if (result.ok) {
                onSuccess?.(result.data)
            } else {
                // Xử lý các trường hợp thất bại
                if (result.need_register) {
                    show_alert_with_config({
                        text: result.message,
                        confirmText: "Đăng ký mới",
                        cancelText: "Nhập lại CCCD",
                        onConfirm: () => {
                            set_show_alert(false)
                            navigate('/non-insur/register', {
                                state: { insurance_data: result.data }
                            })
                        }
                    })
                } else {
                    show_alert_with_config({
                        text: result.message,
                        confirmText: "Ok",
                        onConfirm: () => {
                            set_show_alert(false)
                            onClose()
                        }
                    })
                }
            }
        } catch (error) {
            show_alert_with_config({
                text: insurance_error || "Lỗi kết nối tới máy chủ",
                showConfirmButton: false,
                cancelText: "Đóng"
            })
        } finally {
            setDelayLoading(false)
        }
    }

    const handle_non_insurance_mode = async (input_value) => {
        try {
            setDelayLoading(true)
            const response = await dispatch(check_patient_existed(input_value))
            if (response.ok) {
                onSuccess()
            } else {
                if (response.need_register) {
                    show_alert_with_config({
                        text: response.message,
                        confirmText: "Đăng ký mới",
                        cancelText: "Nhập lại CCCD",
                        onConfirm: () => {
                            set_show_alert(false)
                            navigate('/non-insur/register', {
                                state: { insurance_data: response.data }
                            })
                        }
                    })
                } else {
                    show_alert_with_config({
                        text: response.message,
                        confirmText: "Ok",
                        onConfirm: () => {
                            set_show_alert(false)
                            onClose()
                        }
                    })
                }
            }
        } catch (error) {
            show_alert_with_config({
                text: check_patient_exist_error || "Lỗi kết nối tới máy chủ",
                showConfirmButton: false,
                cancelText: "Đóng"
            })
        } finally {
            setDelayLoading(false)
        }
    }

    const handle_history_mode = async (input_value) => {
        try {
            setDelayLoading(true)
            const response = await dispatch(history_booking_service(input_value))
            if (response.ok) {
                onSuccess()
            } else {
                show_alert_with_config({
                    text: response.message || "Không tìm thấy lịch sử khám bệnh!",
                    showConfirmButton: false,
                    cancelText: "Đóng"
                })
            }
        } catch (error) {
            show_alert_with_config({
                text: history_booking_error || "Lỗi kết nối tới máy chủ",
                showConfirmButton: false,
                cancelText: "Đóng"
            })
        } finally {
            setDelayLoading(false)
        }
    }

    const modeHandlers = {
        insurance: handle_insurance_mode,
        "non-insurance": handle_non_insurance_mode,
        history: handle_history_mode,
    }

    const handle_check_info = async (e) => {
        e.preventDefault()
        const input_value = inputRef.current.value.trim()

        if (!/^\d{12}$/.test(input_value)) {
            set_error_message("Căn cước công dân gồm 12 chữ số")
            return
        }
        set_error_message("")

        await (modeHandlers[mode]?.(input_value) || console.warn("Unknown mode:", mode))
    }

    const handle_key_down_input = (e) => {
        const allowed_keys = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"]
        if (!/[0-9]/.test(e.key) && !allowed_keys.includes(e.key)) {
            e.preventDefault()
            set_error_message("Chỉ được nhập số")
            setTimeout(() => set_error_message(""), 3000)
        } else {
            set_error_message("")
        }
    }

    const loadingMap = {
        insurance: insurance_loading,
        "non-insurance": check_patient_exist_loading,
        history: history_booking_loading,
    }
    const is_loading = loadingMap[mode] || false
    // useEffect(() => {
    //     let timer
    //     if (is_loading) {
    //         setDelayLoading(true)
    //     } else {
    //         timer = setTimeout(() => setDelayLoading(false), timeDelay)
    //     }
    //     return () => clearTimeout(timer)
    // }, [is_loading])
    return (
        <>
            <Helmet>
                <title>Nhập CCCD</title>
            </Helmet>
            <Modal
                open={delayLoading || is_loading}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Đang kiểm tra thông tin, vui lòng chờ</div>
            </Modal>
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-0">
                <div className="w-[80vw] md:w-[50vw] lg:w-[40vw] bg-white z-[100] rounded-md">
                    <div className="flex justify-between w-full items-center py-2 bg-colorOne rounded-t-md">
                        <div className="text-center flex-1 text-white font-semibold text-[18px] lg:text-[22px]">
                            <h2>Nhập thông tin</h2>
                        </div>
                        <div>
                            <Button onClick={onClose} className='!outline-none !border-none mr-2 !text-white font-medium px-3 py-1 rounded-lg !bg-gradient-to-r from-colorTwo to-green-600 hover:!from-green-500 hover:!to-emerald-600 hover:scale-110 transition-all duration-500 ease-in-out'>
                                Trở lại
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-center text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px]">
                        <form className="flex flex-col w-full sm:w-[90%] md:w-[80%] justify-center items-center">
                            <p className='mt-2 text-base text-center'>Vui lòng nhập thẻ căn cước công dân để tiếp tục</p>
                            <input
                                maxLength={12}
                                onKeyDown={handle_key_down_input}
                                inputMode='numeric'
                                pattern='[0-9]*'
                                ref={inputRef}
                                type="text"
                                className="w-[80%] font-medium border-none outline-none text-white rounded-lg bg-[#006709] text-center my-3 p-2 hover:bg-colorFive focus:bg-colorFive"
                                placeholder="Nhập thẻ căn cước công dân"
                                disabled={is_loading}
                            />

                            {error_message && (
                                <p className="text-red-500 text-sm mb-3">{error_message}</p>
                            )}
                            <Spin spinning={delayLoading || is_loading} indicator={<LoadingOutlined />}>
                                <button
                                    type="submit"
                                    className="hover:scale-105 transition-all duration-500 ease-in-out text-white font-medium mb-4 mt-4 px-3 py-1 rounded-lg bg-gradient-to-r from-colorTwo to-colorFive hover:from-green-500 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handle_check_info}
                                    disabled={delayLoading}>
                                    {delayLoading ? 'Đang kiểm tra...' : 'Kiểm tra thông tin'}
                                </button>
                            </Spin>
                        </form>
                    </div>
                </div>
            </div>

            {show_alert && !delayLoading && !is_loading && (
                <Alert
                    textInput={alert_config.text}
                    onClose={() => set_show_alert(false)}
                    onConfirm={alert_config.onConfirm}
                    showConfirmButton={alert_config.showConfirmButton}
                    confirmText={alert_config.confirmText}
                    cancelText={alert_config.cancelText}
                />
            )}
        </>
    )
}

export default InputCCCD