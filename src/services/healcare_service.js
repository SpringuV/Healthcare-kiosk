import { get, post } from "../utils/request"

export const get_service_list = async () =>{
    return await get(`/api/services`)
}

export const post_register_service_check = async (citizen_id, payload)=>{
    return await post(`/orders/create/${citizen_id}`, payload)
}