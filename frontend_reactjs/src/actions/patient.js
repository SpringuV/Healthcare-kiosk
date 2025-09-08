import { check_insurance } from "../services/insurance_service"
import { check_patient_none_insurance, register_user_non_insurance } from "../services/non_insurance_service"
import {
    CHECK_PATIENT_EXIST_FAILURE,
    CHECK_PATIENT_EXIST_REQUEST,
    CHECK_PATIENT_EXIST_NOT_FOUND,
    CHECK_PATIENT_EXIST_SUCCESS,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAILURE,
    CHECK_INSURANCE_REQUEST,
    CHECK_INSURANCE_SUCCESS,
    CHECK_INSURANCE_NOT_FOUND,
    CHECK_INSURANCE_FAILURE,
    RESET_REGISTER_STATE,
    CLEAR_INSURANCE_CHECK,
    CLEAR_PATIENT_EXIST_CHECK,
} from "../constants/user_constant"


// Đăng ký bệnh nhân không bảo hiểm
export const register_user = (formData) => {
    return async (dispatch) => {
        dispatch({
            type: USER_REGISTER_REQUEST,
            payload: {
                loading: true,
                error: null,
                message: null
            }
        })

        try {
            const response = await register_user_non_insurance(formData)

            if (response) {
                dispatch({
                    type: USER_REGISTER_SUCCESS,
                    payload: {
                        ...formData,
                        message: response.message || "Đăng ký thành công",
                        loading: false,
                        is_registered: true,
                        error: null,
                    },
                })
                return response.data || formData
            } else {
                throw new Error(response.message || "Đăng ký thất bại")
            }
        } catch (error) {
            dispatch({
                type: USER_REGISTER_FAILURE,
                payload: {
                    error: error.message,
                    loading: false,
                    is_registered: false,
                    message: null
                }
            })
            throw error
        }
    }
}

// Kiểm tra bảo hiểm y tế
export const check_insurance_user = (citizenId) => {
    return async (dispatch) => {
        dispatch({
            type: CHECK_INSURANCE_REQUEST, payload: {
                loading: true,
                error: null,
                message: null,
                need_register: false
            }
        })
        try {
            const response = await check_insurance(citizenId)

            if (response.status === 404) {
                dispatch({
                    type: CHECK_INSURANCE_NOT_FOUND,
                    payload: { message: "Không có thông tin bảo hiểm y tế" },
                })
                return { ok: false, message: "Không có thông tin bảo hiểm y tế" }
            }

            if (response.data) {
                const insurance = response.data

                if (!insurance.is_activate) {
                    dispatch({
                        type: CHECK_INSURANCE_NOT_FOUND,
                        payload: {
                            message: "Bảo hiểm y tế đã hết hạn",
                            insurance_data: insurance,
                            loading: false,
                            hasInsurance: false,
                        },
                    })
                    return {
                        ok: false,
                        message: "Bảo hiểm y tế đã hết hạn",
                        data: insurance,
                    }
                }

                if (!insurance.is_saved) {
                    dispatch({
                        type: CHECK_INSURANCE_NOT_FOUND,
                        payload: {
                            message: "Không tìm thấy thông tin bệnh nhân",
                            need_register: true,
                            insurance_data: insurance,
                        },
                    })
                    return {
                        ok: false,
                        message: "Không tìm thấy thông tin bệnh nhân",
                        need_register: true,
                        data: insurance,
                    }
                }

                dispatch({
                    type: CHECK_INSURANCE_SUCCESS,
                    payload: {
                        ...insurance,
                        message: "Tìm thấy thông tin bảo hiểm hợp lệ",
                        loading: false,
                        error: null,
                        hasInsurance: true,
                        insuranceExpired: false,
                        need_register: false,
                    },
                })
                return { ok: true, data: insurance }
            }
        } catch (error) {
            dispatch({
                type: CHECK_INSURANCE_FAILURE,
                payload: {
                    error: error.message || "Lỗi kết nối tới máy chủ",
                    loading: false,
                    hasInsurance: false,
                    need_register: false
                }
            })
            throw error
        }
    }
}

// Tìm kiếm thông tin người khám
export const check_patient_existed = (citizenId) => {
    return async (dispatch) => {
        dispatch({
            type: CHECK_PATIENT_EXIST_REQUEST,
            payload: {
                loading: true,
                message: null,
                isRegistered: false,
            }
        })

        try {
            const response = await check_patient_none_insurance(citizenId)
            if (response.status === 404) {
                dispatch({
                    type: CHECK_PATIENT_EXIST_NOT_FOUND,
                    payload: {
                        message: "Không có thông tin người khám",
                        need_register: true,
                        loading: false,
                        isRegistered: false,
                    },

                })
                return { ok: false, message: "Không có thông tin người khám", need_register: true }
            }

            const patient_info = response.data
            dispatch({
                type: CHECK_PATIENT_EXIST_SUCCESS,
                payload: {
                    ...patient_info,
                    loading: false,
                    message: "Tìm thấy thông tin người khám",
                }
            })
            return { ok: true, data: patient_info }
        } catch (error) {
            dispatch({
                type: CHECK_PATIENT_EXIST_FAILURE,
                payload: {
                    error: error.message || "Lỗi kết nối tới máy chủ",
                    loading: false,
                },
            })
            throw error
        }
    }
}

// Action sync
export const clear_patient_register = () => ({ type: RESET_REGISTER_STATE })
export const clear_insurance_check = () => ({ type: CLEAR_INSURANCE_CHECK })
export const clear_patient_exist_check = () => ({ type: CLEAR_PATIENT_EXIST_CHECK })