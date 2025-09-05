import { get, put } from "../utils/request"

export const patient_get_history_check = async (citizen_id) => {
    return await get(`/patient/history/${citizen_id}`)
}

export const patient_put_cancelled_payment = async (order_id) => {
    return await put(`/orders/cancel/${order_id}`)
}

export const patient_get_qr_code = async (order_id) => {
    return await get(`/showQR/${order_id}`)
}