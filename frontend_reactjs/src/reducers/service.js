import { CLEAR_BOOKING_SERVICE, PATIENT_BOOKING_SERVICE_FAILURE, PATIENT_BOOKING_SERVICE_REQUEST, PATIENT_BOOKING_SERVICE_SUCCESS } from "../constants/user_constant"

const patient_register_service_init = {
    citizen_id: "",
    fullname: "",
    gender: "",
    dob: "",
    queue_number: "",
    time_order: "",
    is_insurrance: "",
    use_insurrance: "",
    service_name: "",
    clinic_name: "",
    address_room: "",
    doctor_name: "",
    price: "",
    order_id: "",

    // state management
    loading: false,
    error: null,
    message: null,
}

export const patient_booking_service_reducer = (state = patient_register_service_init, action) => {
    switch (action.type) {
        case PATIENT_BOOKING_SERVICE_REQUEST:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.message,
            }
        case PATIENT_BOOKING_SERVICE_SUCCESS:
            return {
                ...state,
                citizen_id: action.payload.citizen_id,
                fullname: action.payload.fullname,
                gender: action.payload.gender,
                dob: action.payload.dob,
                queue_number: action.payload.queue_number,
                time_order: action.payload.time_order,
                is_insurrance: action.payload.is_insurrance,
                use_insurrance: action.payload.use_insurrance,
                service_name: action.payload.service_name,
                clinic_name: action.payload.clinic_name,
                address_room: action.payload.address_room,
                doctor_name: action.payload.doctor_name,
                price: action.payload.price,
                order_id: action.payload.order_id,

                // cap nhat state management
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.message,
            }
        case PATIENT_BOOKING_SERVICE_FAILURE:
            return {
                ...state,
                loading: action.payload.loading,
                error: action.payload.error,
                message: action.payload.message,
            }
        case CLEAR_BOOKING_SERVICE:
            return patient_register_service_init

        default:
            return state
    }
}