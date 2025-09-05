import { get } from "../utils/request"

export const check_insurance = async (citizen_id)=>{
    return await get(`/health-insurances/${citizen_id}`)
}