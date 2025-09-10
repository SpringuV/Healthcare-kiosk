import {
    CHECK_PATIENT_EXIST_FAILURE,
    CHECK_PATIENT_EXIST_REQUEST,
    CHECK_PATIENT_EXIST_NOT_FOUND,
    CHECK_PATIENT_EXIST_SUCCESS,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAILURE,
    UPDATE_REGISTER_FORM,
    CHECK_INSURANCE_REQUEST,
    CHECK_INSURANCE_SUCCESS,
    CHECK_INSURANCE_NOT_FOUND,
    CHECK_INSURANCE_FAILURE,
    CLEAR_REGISTER_ERROR,
    CLEAR_INSURANCE_CHECK,
    CLEAR_INSURANCE_ERROR,
    CLEAR_PATIENT_EXIST_CHECK,
    RESET_REGISTER_STATE,
    HISTORY_BOOKING_REQUEST,
    HISTORY_BOOKING_FAILURE,
    HISTORY_BOOKING_SUCCESS,
    CLEAR_HISTORY_BOOKING,
} from "../constants/user_constant"


// PATIENT REGISTER REDUCER
const initialRegisterState = {
    // form data
    full_name: '',
    dob: '',
    address: '',
    gender: '',
    patient_id: '',
    job: '',
    ethnic: '',
    phone_number: '',
    is_insurance: false,
    // state management
    loading: false,
    error: null,
    is_registered: false,
    message: null
}

export const patient_register_reducer = (state = initialRegisterState, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.message
            }

        case USER_REGISTER_SUCCESS:
            return {
                ...state,
                loading: action.payload.loading,
                is_registered: action.payload.is_registered,
                message: action.payload.message,
                error: action.payload.error,
                // Cập nhật form data với data đã submit thành công
                full_name: action.payload.full_name || state.full_name,
                dob: action.payload.dob || state.dob,
                address: action.payload.address || state.address,
                gender: action.payload.gender !== undefined ? action.payload.gender : state.gender,
                patient_id: action.payload.patient_id || state.patient_id,
                job: action.payload.job || state.job,
                ethnic: action.payload.ethnic || state.ethnic,
                phone_number: action.payload.phone_number || state.phone_number,
            }

        case USER_REGISTER_FAILURE:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                is_registered: action.payload.is_registered,
                message: action.payload.message
            }

        case RESET_REGISTER_STATE:
            return initialRegisterState

        case CLEAR_REGISTER_ERROR:
            return {
                ...state,
                error: null
            }

        // Action để update form data trực tiếp (optional)
        case UPDATE_REGISTER_FORM:
            return {
                ...state,
                ...action.payload
            }

        default:
            return state
    }
}
// --------END PATIENT REGISTER REDUCER -----------
// INSURANCE CHECK REDUCER
const initialInsuranceState = {
    // Insurance data
    citizen_id: "",
    full_name: "",
    dob: "",
    valid_from: "",
    expired: "",
    registration_place: "",
    phone_number: "",
    gender: "",
    is_activate: false,
    is_saved: false,

    // State management
    loading: false,
    error: null,
    message: null,
    need_register: false,

    // Additional states
    hasInsurance: false,
    insuranceExpired: false
}

export const check_insurance_reducer = (state = initialInsuranceState, action) => {
    switch (action.type) {
        case CHECK_INSURANCE_REQUEST:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.message,
                need_register: action.payload.need_register
            }

        case CHECK_INSURANCE_SUCCESS:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                hasInsurance: action.payload.hasInsurance,
                insuranceExpired: action.payload.insuranceExpired,
                need_register: action.payload.need_register,
                // Cập nhật tất cả thông tin bảo hiểm
                citizen_id: action.payload.citizen_id || "",
                full_name: action.payload.full_name || "",
                dob: action.payload.dob || "",
                valid_from: action.payload.valid_from || "",
                expired: action.payload.expired || "",
                registration_place: action.payload.registration_place || "",
                phone_number: action.payload.phone_number || "",
                gender: action.payload.gender || "",
                is_activate: action.payload.is_activate || false,
                is_saved: action.payload.is_saved || false,
                message: action.payload.message || "Kiểm tra bảo hiểm thành công"
            }

        case CHECK_INSURANCE_NOT_FOUND:
            return {
                ...state,
                loading: action.payload.loading,
                hasInsurance: action.payload.hasInsurance,
                error: action.payload.message,
                message: action.payload.message,
                need_register: action.payload.need_register || false,
                insuranceExpired: action.payload.message?.includes("hết hạn") || false,
                // Nếu có thông tin bảo hiểm nhưng hết hạn hoặc chưa đăng ký
                ...(action.payload.insurance_data && {
                    citizen_id: action.payload.insurance_data.citizen_id || "",
                    full_name: action.payload.insurance_data.full_name || "",
                    dob: action.payload.insurance_data.dob || "",
                    valid_from: action.payload.insurance_data.valid_from || "",
                    expired: action.payload.insurance_data.expired || "",
                    registration_place: action.payload.insurance_data.registration_place || "",
                    phone_number: action.payload.insurance_data.phone_number || "",
                    gender: action.payload.insurance_data.gender || "",
                    is_activate: action.payload.insurance_data.is_activate || false,
                    is_saved: action.payload.insurance_data.is_saved || false,
                })
            }

        case CHECK_INSURANCE_FAILURE:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.error,
                hasInsurance: action.payload.hasInsurance,
                need_register: action.payload.need_register
            }

        case CLEAR_INSURANCE_CHECK:
            return initialInsuranceState

        case CLEAR_INSURANCE_ERROR:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}
//----------END INSURANCE CHECK REDUCER---------

// CHECK PATIENT EXIST
const initial_patient_exist = {
    patient_id: "",
    full_name: "",
    gender: "",
    dob: "",
    address: "",
    phone_number: "",
    ethnic: "",
    job: "",

    // State management
    loading: false,
    error: null,
    message: null,
    isRegistered: false,
    need_register: false,
}
export const check_patient_exist_reducer = (state = initial_patient_exist, action) => {
    switch (action.type) {
        case CHECK_PATIENT_EXIST_REQUEST:
            return {
                ...state,
                loading: action.payload.loading,
                message: action.payload.message,
                isRegistered: action.payload.isRegistered,
            }
        case CHECK_PATIENT_EXIST_NOT_FOUND:
            return {
                ...state,
                loading: action.payload.loading,
                message: action.payload.message,
                isRegistered: action.payload.isRegistered,
                need_register: action.payload.need_register,
            }
        case CHECK_PATIENT_EXIST_SUCCESS:
            return {
                ...state,
                loading: action.payload.loading,
                patient_id: action.payload.patient_id || "",
                full_name: action.payload.full_name || "",
                gender: action.payload.gender || "",
                dob: action.payload.dob || "",
                address: action.payload.address || "",
                phone_number: action.payload.phone_number || "",
                ethnic: action.payload.ethnic || "",
                job: action.payload.job || "",
                message: action.payload.message || "Tìm thấy thông tin người khám"
            }
        case CHECK_PATIENT_EXIST_FAILURE:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.error,
            }
        case CLEAR_PATIENT_EXIST_CHECK:
            return initial_patient_exist

        default:
            return state

    }
}

// --------------CHECK PATIENT EXIST------------

// ----------------HISTORY BOOKING----------------
const initial_history_booking = {
    history: [],
    loading: false,
    error: null,
    message: null,
}
export const history_booking_reducer = (state = initial_history_booking, action) => {
    switch (action.type) {
        case HISTORY_BOOKING_REQUEST:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.message,
            }
        case HISTORY_BOOKING_FAILURE:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.message,
                history: [],
            }
        case HISTORY_BOOKING_SUCCESS:
            return {
                ...state,
                loading: action.payload.loading,
                history: action.payload.history,
                message: action.payload.message,
                error: null,
            }
        case CLEAR_HISTORY_BOOKING:
            return initial_history_booking
        default:
            return state
    }
}