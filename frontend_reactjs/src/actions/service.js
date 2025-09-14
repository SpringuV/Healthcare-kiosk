import { CLEAR_BOOKING_SERVICE, PATIENT_BOOKING_SERVICE_FAILURE, PATIENT_BOOKING_SERVICE_REQUEST, PATIENT_BOOKING_SERVICE_SUCCESS } from "../constants/user_constant"
import { post_register_service_check } from "../services/healcare_service"

export const patient_booking_service = (citizen_id, data) => {
    return async (dispatch) => {
        dispatch({
            type: PATIENT_BOOKING_SERVICE_REQUEST,
            payload: {
                loading: true,
                error: null,
                message: null,
            },
        })

        try {
            const response = await post_register_service_check(citizen_id, data)
            if (response.status === 200) {
                dispatch({
                    type: PATIENT_BOOKING_SERVICE_SUCCESS,
                    payload: {
                        ...response.data,
                        loading: false,
                        error: null,
                        message: null,
                    }
                })
            } else {
                dispatch({
                    type: PATIENT_BOOKING_SERVICE_FAILURE,
                    payload: {
                        loading: false,
                        error: "Lỗi",
                        message: response.data["detail"] +". Yêu cầu quay lại trang chủ thực hiện lại."
                    }
                })
                throw new Error(response.data["detail"] +". Yêu cầu quay lại trang chủ thực hiện lại.")
            }
        } catch (error) {
            dispatch({
                type: PATIENT_BOOKING_SERVICE_FAILURE,
                payload: {
                    error: error.message,
                    loading: false,
                    message: "Đăng kí dịch vụ để khám lỗi !"
                }
            })
            console.error("Lỗi khi gọi API tạo order:", error)
            throw error
        }
    }
}

export const clear_booking_service = () => ({
  type: CLEAR_BOOKING_SERVICE,
})