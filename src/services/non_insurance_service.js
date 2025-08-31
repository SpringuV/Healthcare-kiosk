import { get, post } from "../utils/request"

export const register_user_non_insurance = async (payload) => {
    return await post("/patient/register", payload)
}

export const check_patient_none_insurance = async (citizen_id) => {
    return get(`/patient/check/${citizen_id}`)
}