// actions.js
// import { check_insurance } from "../services/insurance_service"
import { register_user_non_insurance } from "../services/non_insurance_service"

export const registerUser = (formData) => {
    return async (dispatch) => {
        // báo cho reducer biết "đang gửi request"
        dispatch({ type: "USER_REGISTER_REQUEST" })

        try {
            const response = await register_user_non_insurance(formData)
            // báo thành công
            if (response) {
                dispatch({
                    type: "USER_REGISTER_SUCCESS",
                    payload: {
                        ...formData,
                        message: response.message || "Đăng ký thành công"
                    }
                })
            }

            return formData
        } catch (error) {
            // báo thất bại
            dispatch({ type: "USER_REGISTER_FAILURE", payload: error.message })
            throw error // QUAN TRỌNG: Phải throw error để component biết
        }
    }
}

export const clearRegisterError = () => {
    return {
        type: "CLEAR_REGISTER_ERROR"
    }
}
