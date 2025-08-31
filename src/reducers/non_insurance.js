const initialState = {
    // form data
    full_name: '',
    dob: '',
    address: '',
    gender: '',
    patient_id: '',
    job: '',
    ethnic: '',
    phone_number: '',
    // state management
    loading: false,
    error: null,
    data: null,
    isRegistered: false, // Thêm flag để biết đã đăng ký thành công
    message: null, // Message từ server
}

const non_insurance_reducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_REGISTER_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
                message: null
            }

        case "USER_REGISTER_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.payload,
                isRegistered: true,
                message: action.payload.message,
                error: null,
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
        case "USER_REGISTER_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload,
                isRegistered: false,
                message: null
            }

        case "RESET_REGISTER_STATE":
            return initialState

        case "CLEAR_REGISTER_ERROR":
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export default non_insurance_reducer
